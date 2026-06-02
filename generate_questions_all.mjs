import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "");

async function generateBatch(subject, syllabusText, count, existingQuestionsCount) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `Generate a JSON object containing exactly ${count} unique and diverse multiple-choice questions for the ${subject} exam based on this syllabus:
    ${syllabusText}
    
    Current question count: ${existingQuestionsCount}. 
    Focus on covering topics that are underrepresented. 
    Avoid repeating questions. Ensure each question has a detailed "premium" AI explanation in Markdown.
    
    The JSON structure MUST be:
    {
      "questions": [
        {
          "id": integer (starting from ${existingQuestionsCount + 1}),
          "topic": "string",
          "section": "string",
          "subtopic": "string",
          "difficulty": "easy" | "medium" | "hard",
          "question": "string",
          "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
          "answer": "A" | "B" | "C" | "D",
          "explanation": "Detailed Markdown string"
        }
      ]
    }`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed.questions || [];
  } catch (error) {
    console.error(`Error generating batch for ${subject}:`, error);
    return [];
  }
}

async function processSubject(subjectDir, fullPath) {
  const files = fs.readdirSync(fullPath);
  const syllabusFile = files.find(f => f === 'syllabus.json');
  const questionsFile = path.join(fullPath, 'questions.json');

  if (!syllabusFile) {
    console.log(`No syllabus found in ${fullPath}`);
    return;
  }

  const syllabus = JSON.parse(fs.readFileSync(path.join(fullPath, syllabusFile), 'utf8'));
  const subjectName = syllabus.syllabus_title || syllabus.subject || subjectDir;
  
  // Robust text extraction
  let topics = [];
  if (syllabus.topics) topics = syllabus.topics;
  else if (syllabus.syllabus_sections) topics = syllabus.syllabus_sections;
  else if (syllabus.sections) topics = syllabus.sections;
  else if (syllabus.detailed_syllabus && syllabus.detailed_syllabus.sections) topics = syllabus.detailed_syllabus.sections;

  const syllabusText = topics.map(s => {
    let title = s.title || s.section || '';
    let subtopics = [];
    if (s.subtopics) subtopics = s.subtopics;
    else if (s.details) subtopics = s.details;
    else if (s.topics) {
      subtopics = s.topics.map(t => `${t.title}: ${(t.subtopics || []).join(', ')}`);
    }
    return `${title}: ${Array.isArray(subtopics) ? subtopics.join(', ') : subtopics}`;
  }).join('\n');

  let existingQuestions = { questions: [] };
  if (fs.existsSync(questionsFile)) {
    try {
      existingQuestions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
    } catch (e) {
      existingQuestions = { questions: [] };
    }
  }

  const TARGET_COUNT = 750;
  const BATCH_SIZE = 30;

  console.log(`Processing ${subjectName}... Current count: ${existingQuestions.questions.length}`);

  while (existingQuestions.questions.length < TARGET_COUNT) {
    const remaining = TARGET_COUNT - existingQuestions.questions.length;
    const batchSize = Math.min(BATCH_SIZE, remaining);
    
    console.log(`Generating ${batchSize} questions for ${subjectName}...`);
    const newQuestions = await generateBatch(subjectName, syllabusText, batchSize, existingQuestions.questions.length);
    
    if (newQuestions && newQuestions.length > 0) {
      existingQuestions.questions.push(...newQuestions);
      fs.writeFileSync(questionsFile, JSON.stringify(existingQuestions, null, 2));
      console.log(`Updated ${subjectName}. Total: ${existingQuestions.questions.length}`);
      await new Promise(r => setTimeout(r, 2000)); // Rate limit pause
    } else {
      console.log(`Failed to generate batch for ${subjectName}. Retrying in 30s...`);
      await new Promise(r => setTimeout(r, 30000));
    }
  }
}

async function main() {
  const baseSyllabusDir = path.join(process.cwd(), 'data general', 'syllabus.json');
  const exams = ['jamb syllabus', 'waec syllabus', 'bece syllabus'];

  for (const exam of exams) {
    const examPath = path.join(baseSyllabusDir, exam);
    if (!fs.existsSync(examPath)) continue;

    const subjects = fs.readdirSync(examPath, { withFileTypes: true })
                       .filter(dirent => dirent.isDirectory())
                       .map(dirent => dirent.name);

    console.log(`Found ${subjects.length} subjects in ${exam}`);

    for (const subject of subjects) {
      const fullPath = path.join(examPath, subject);
      await processSubject(subject, fullPath);
    }
  }
}

main();
