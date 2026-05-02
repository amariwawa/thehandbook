import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

async function generateBatch(subject, syllabusText, count, existingQuestionsCount) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro-latest",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `Generate a JSON object containing exactly ${count} unique and diverse multiple-choice questions for the WAEC ${subject} exam based on this syllabus:
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

async function processSubject(subjectDir) {
  const exam = 'waec';
  const subjectPath = path.join('data general', 'data', 'syllabuses', exam, subjectDir);
  
  if (!fs.existsSync(subjectPath)) return;
  
  const files = fs.readdirSync(subjectPath);
  const syllabusFile = files.find(f => f.includes('syllabus.json'));
  const questionsFile = path.join(subjectPath, 'questions.json');

  if (!syllabusFile) {
    console.log(`No syllabus found for ${subjectDir}`);
    return;
  }

  const syllabus = JSON.parse(fs.readFileSync(path.join(subjectPath, syllabusFile), 'utf8'));
  const subjectName = syllabus.subject || subjectDir;
  
  const syllabusText = (syllabus.topics || syllabus.syllabus_sections || []).map(s => 
    `${s.title || s.section}: ${(s.subtopics || s.details || []).join(', ')}`
  ).join('\n');

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
      existingQuestions.total = existingQuestions.questions.length;
      existingQuestions.subject = subjectName;
      existingQuestions.exam = "WAEC";
      existingQuestions.generated = "2026";
      
      fs.writeFileSync(questionsFile, JSON.stringify(existingQuestions, null, 2));
      console.log(`Updated ${subjectName}. Total: ${existingQuestions.questions.length}`);
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log(`Failed to generate batch for ${subjectName}. Retrying in 30s...`);
      await new Promise(r => setTimeout(r, 30000));
    }
  }
}

async function main() {
  const specificSubject = process.argv[2];
  const waecPath = path.join('data general', 'data', 'syllabuses', 'waec');
  const subjects = [];

  function findSubjects(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let hasSyllabus = false;
    
    for (const item of items) {
      if (item.isDirectory()) {
        findSubjects(path.join(dir, item.name));
      } else if (item.name.includes('syllabus.json')) {
        hasSyllabus = true;
      }
    }
    
    if (hasSyllabus) {
      subjects.push(path.relative(waecPath, dir));
    }
  }

  findSubjects(waecPath);
  
  if (specificSubject) {
    console.log(`Targeting specific subject: ${specificSubject}`);
    await processSubject(specificSubject);
    return;
  }
  
  // Prioritize core subjects the user cares about
  const priority = ['civic-education', 'economics', 'government', 'christian-religious-studies-new', 'biology/biology', 'agricultural-science', 'general-mathematics-or-mathematics-core', 'english-language', 'marketing'];
  
  const sortedSubjects = subjects.sort((a, b) => {
    const aPri = priority.indexOf(a);
    const bPri = priority.indexOf(b);
    if (aPri !== -1 && bPri !== -1) return aPri - bPri;
    if (aPri !== -1) return -1;
    if (bPri !== -1) return 1;
    return a.localeCompare(b);
  });

  console.log(`Found ${sortedSubjects.length} subjects to check.`);

  for (const subject of sortedSubjects) {
    await processSubject(subject);
  }
}

main();
