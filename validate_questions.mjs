import fs from 'fs';
import path from 'path';

function validateQuestionsFile(subjectFolder, questionsPath) {
  if (!fs.existsSync(questionsPath)) {
    return { valid: false, error: "questions.json file does not exist" };
  }
  
  let data;
  try {
    const fileContent = fs.readFileSync(questionsPath, 'utf8');
    data = JSON.parse(fileContent);
  } catch (e) {
    return { valid: false, error: `Invalid JSON format: ${e.message}` };
  }
  
  if (!data || !Array.isArray(data.questions)) {
    return { valid: false, error: "Missing or invalid 'questions' array root" };
  }
  
  const questions = data.questions;
  if (questions.length !== 750) {
    return { valid: false, error: `Expected exactly 750 questions, found ${questions.length}` };
  }
  
  const requiredKeys = ["id", "topic", "section", "subtopic", "difficulty", "question", "options", "answer", "explanation"];
  const validDifficulties = new Set(["easy", "medium", "hard"]);
  const validAnswers = new Set(["A", "B", "C", "D"]);
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const qIndexStr = `question index ${i} (ID: ${q?.id || 'unknown'})`;
    
    // Check keys
    for (const key of requiredKeys) {
      if (!(key in q)) {
        return { valid: false, error: `Missing key '${key}' at ${qIndexStr}` };
      }
    }
    
    // Type and value checks
    if (typeof q.id !== 'number') return { valid: false, error: `'id' must be a number at ${qIndexStr}` };
    if (typeof q.topic !== 'string' || q.topic.trim() === '') return { valid: false, error: `'topic' must be a non-empty string at ${qIndexStr}` };
    if (typeof q.section !== 'string' || q.section.trim() === '') return { valid: false, error: `'section' must be a non-empty string at ${qIndexStr}` };
    if (typeof q.subtopic !== 'string' || q.subtopic.trim() === '') return { valid: false, error: `'subtopic' must be a non-empty string at ${qIndexStr}` };
    if (!validDifficulties.has(q.difficulty)) return { valid: false, error: `Invalid difficulty '${q.difficulty}' at ${qIndexStr}` };
    if (typeof q.question !== 'string' || q.question.trim() === '') return { valid: false, error: `'question' must be a non-empty string at ${qIndexStr}` };
    if (typeof q.explanation !== 'string' || q.explanation.trim() === '') return { valid: false, error: `'explanation' must be a non-empty string at ${qIndexStr}` };
    
    // Options checks
    if (typeof q.options !== 'object' || q.options === null) {
      return { valid: false, error: `'options' must be an object at ${qIndexStr}` };
    }
    const optionKeys = ["A", "B", "C", "D"];
    for (const key of optionKeys) {
      if (!(key in q.options)) {
        return { valid: false, error: `Missing option key '${key}' at ${qIndexStr}` };
      }
      if (typeof q.options[key] !== 'string' || q.options[key].trim() === '') {
        return { valid: false, error: `Option '${key}' must be a non-empty string at ${qIndexStr}` };
      }
    }
    
    // Answer check
    if (!validAnswers.has(q.answer)) {
      return { valid: false, error: `Invalid answer '${q.answer}' (must be A, B, C, or D) at ${qIndexStr}` };
    }
  }
  
  return { valid: true };
}

function main() {
  const baseSyllabusDir = path.join(process.cwd(), 'data general', 'syllabus.json', 'waec syllabus');
  if (!fs.existsSync(baseSyllabusDir)) {
    console.error(`Error: WAEC syllabus directory not found at ${baseSyllabusDir}`);
    process.exit(1);
  }
  
  const folders = fs.readdirSync(baseSyllabusDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log(`Checking ${folders.length} subject folders in WAEC syllabus...`);
  
  let validCount = 0;
  let invalidCount = 0;
  const reports = [];
  
  for (const folder of folders) {
    const fullPath = path.join(baseSyllabusDir, folder);
    const syllabusPath = path.join(fullPath, 'syllabus.json');
    const questionsPath = path.join(fullPath, 'questions.json');
    
    if (!fs.existsSync(syllabusPath)) {
      continue; // Skip if no syllabus exists (not a valid subject folder)
    }
    
    const result = validateQuestionsFile(folder, questionsPath);
    if (result.valid) {
      validCount++;
      reports.push({ subject: folder, status: "VALID" });
    } else {
      invalidCount++;
      reports.push({ subject: folder, status: "INVALID", error: result.error });
    }
  }
  
  console.log(`\n=== Validation Reports ===`);
  for (const r of reports) {
    if (r.status === "VALID") {
      console.log(`[VALID]   ${r.subject}`);
    } else {
      console.log(`[INVALID] ${r.subject} - Error: ${r.error}`);
    }
  }
  
  console.log(`\n=== Validation Summary ===`);
  console.log(`Total Valid:   ${validCount}`);
  console.log(`Total Invalid: ${invalidCount}`);
  
  if (invalidCount > 0) {
    process.exit(1);
  } else {
    console.log(`\nAll processed subjects are perfectly valid!`);
  }
}

main();
