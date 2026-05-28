import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.7,
  }
});

function extractSyllabusText(syllabus) {
  let text = [];

  if (syllabus.sections) {
    for (const section of syllabus.sections) {
      const sectionTitle = section.section || section.title || '';
      text.push(`SECTION: ${sectionTitle}`);
      const topics = section.topics || [];
      for (const topic of topics) {
        const topicName = topic.topic || topic.title || '';
        const content = topic.content || topic.description || '';
        const objectives = topic.objectives || topic.subtopics || [];
        text.push(`  TOPIC: ${topicName}`);
        if (content) text.push(`    CONTENT: ${content}`);
        if (objectives.length) text.push(`    OBJECTIVES: ${objectives.join('; ')}`);
      }
    }
  } else if (syllabus.topics) {
    for (const topic of syllabus.topics) {
      text.push(`TOPIC: ${topic.title || topic.topic || ''}`);
      if (topic.subtopics) text.push(`  SUBTOPICS: ${topic.subtopics.join('; ')}`);
      if (topic.content) text.push(`  CONTENT: ${topic.content}`);
    }
  } else if (syllabus.syllabus_sections) {
    for (const section of syllabus.syllabus_sections) {
      text.push(`SECTION: ${section.title || section.section || ''}`);
      const details = section.details || section.subtopics || [];
      for (const d of details) {
        text.push(`  - ${typeof d === 'string' ? d : (d.title || d.topic || JSON.stringify(d))}`);
      }
    }
  } else {
    text.push(JSON.stringify(syllabus, null, 2).slice(0, 4000));
  }

  return text.join('\n');
}

async function generateQuestionsForSubject(subjectName, syllabusText, count = 30) {
  const prompt = `You are an expert Nigerian exam question setter for ${subjectName}. Generate ${count} realistic, subject-specific multiple-choice exam questions STRICTLY based on the following syllabus content.

CRITICAL RULES:
1. Questions must be ACTUAL ${subjectName} exam questions - NOT generic template questions.
2. For Mathematics: include real calculations, formulas, equations, geometry problems, word problems with numbers.
3. For Sciences (Physics, Chemistry, Biology): include real scientific concepts, definitions with specific facts, calculations where applicable, experimental scenarios.
4. For Arts/Social Studies (Government, History, CRS, Literature, etc.): include real historical dates, specific events, constitutional provisions, literary analysis, named personalities.
5. For Commercial (Economics, Commerce, Accounts, etc.): include real business scenarios, calculations (profit/loss, ratios), economic theories, named principles.
6. For Vocational/Technical: include practical procedures, specific tools, safety measures, materials.
7. Each question MUST have exactly 4 options (A, B, C, D) with only ONE correct answer.
8. The "explanation" must teach the concept - explain WHY the answer is correct and why others are wrong, citing specific syllabus content.
9. Questions should vary in difficulty (easy, medium, hard).
10. Cover ALL major topics in the syllabus proportionally.

SYLLABUS:
${syllabusText}

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "topic": "exact topic name from syllabus",
      "section": "exact section name from syllabus",
      "subtopic": "specific subtopic",
      "difficulty": "easy|medium|hard",
      "question": "the actual exam question text",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": "A|B|C|D",
      "explanation": "Detailed explanation with reasoning..."
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed.questions || [];
  } catch (error) {
    console.error(`Error generating for ${subjectName}:`, error.message);
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
  const subjectName = syllabus.exam || syllabus.syllabus_title || syllabus.subject || subjectDir;
  const syllabusText = extractSyllabusText(syllabus);

  console.log(`\n=== Processing: ${subjectName} ===`);

  const TARGET_COUNT = 150;
  const BATCH_SIZE = 15;
  const allQuestions = [];
  let attempt = 0;
  const maxAttempts = Math.ceil((TARGET_COUNT / BATCH_SIZE) * 2);

  while (allQuestions.length < TARGET_COUNT && attempt < maxAttempts) {
    attempt++;
    const remaining = TARGET_COUNT - allQuestions.length;
    const batchSize = Math.min(BATCH_SIZE, remaining);

    console.log(`  Generating batch ${attempt} (${batchSize} questions, ${allQuestions.length} so far)...`);
    const newQuestions = await generateQuestionsForSubject(subjectName, syllabusText, batchSize);

    if (newQuestions && newQuestions.length > 0) {
      const validQuestions = newQuestions.filter(q =>
        q.question && q.options && q.answer &&
        q.options.A && q.options.B && q.options.C && q.options.D
      );

      for (const q of validQuestions) {
        q.id = allQuestions.length + 1;
        allQuestions.push(q);
      }

      console.log(`  -> Added ${validQuestions.length} valid questions. Total: ${allQuestions.length}`);

      fs.writeFileSync(questionsFile, JSON.stringify({ questions: allQuestions }, null, 2));

      if (validQuestions.length === 0) {
        await new Promise(r => setTimeout(r, 5000));
      } else {
        await new Promise(r => setTimeout(r, 1500));
      }
    } else {
      console.log(`  -> Failed batch. Retrying in 10s...`);
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  console.log(`=== Completed ${subjectName}: ${allQuestions.length} questions ===`);
}

async function main() {
  const baseSyllabusDir = path.join(process.cwd(), 'data general', 'syllabus.json');
  const exams = ['jamb syllabus', 'waec syllabus'];

  for (const exam of exams) {
    const examPath = path.join(baseSyllabusDir, exam);
    if (!fs.existsSync(examPath)) {
      console.log(`Exam path not found: ${examPath}`);
      continue;
    }

    const subjects = fs.readdirSync(examPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`\n========================================`);
    console.log(`Found ${subjects.length} subjects in ${exam}`);
    console.log(`========================================`);

    for (const subject of subjects) {
      const fullPath = path.join(examPath, subject);
      await processSubject(subject, fullPath);
    }
  }

  console.log('\n\nALL DONE!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
