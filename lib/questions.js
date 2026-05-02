import fs from 'fs';
import path from 'path';

// Helper to load data
function loadData(exam, subject) {
  const filePath = path.join(process.cwd(), 'data', 'syllabuses', exam.toLowerCase(), subject.toLowerCase(), 'questions.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load questions for ${exam} ${subject}:`, error);
    return { questions: [] };
  }
}

// Get all questions for a subject
export function getAllQuestions(exam, subject) {
  const data = loadData(exam, subject);
  return data.questions || [];
}

// Get questions filtered by topic
export function getQuestionsByTopic(exam, subject, topic) {
  const all = getAllQuestions(exam, subject);
  return all.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
}

// Get questions filtered by difficulty
export function getQuestionsByDifficulty(exam, subject, difficulty) {
  const all = getAllQuestions(exam, subject);
  return all.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
}

// Get a random set of questions for a quiz
export function getRandomQuestions(exam, subject, count, topic = null) {
  let questions = topic ? getQuestionsByTopic(exam, subject, topic) : getAllQuestions(exam, subject);
  
  // Shuffle
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get questions by section
export function getQuestionsBySection(exam, subject, section) {
  const all = getAllQuestions(exam, subject);
  return all.filter(q => q.section.toLowerCase() === section.toLowerCase());
}
