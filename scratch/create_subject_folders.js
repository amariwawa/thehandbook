const fs = require('fs');
const path = require('path');

const baseDir = '/Users/macbookair/h@ndbook/data general/data/syllabuses';

const jambSubjects = [
  "Agriculture", "Art", "Arabic", "Biology", "Chemistry", 
  "Computer Studies", "Commerce", "CRS", "Economics", "French", 
  "Geography", "Government", "Hausa", "History", "Home Economics", 
  "IGBO", "Islamic Studies", "Literature", "Mathematics", "Music", 
  "Physical & Health Education (PHE)", "Physics", "Principles of Account", 
  "Use of English", "Yoruba"
];

const beceSubjects = [
  "Basic Science", "Basic Technology", "Business Studies", 
  "Social Studies", "Home Economics", "Cultural & Creative Arts", 
  "Physical & Health Education", "Computer Studies", "Mathematics", 
  "English Language"
];

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function createFolders(exam, subjects) {
  const examDir = path.join(baseDir, exam);
  if (!fs.existsSync(examDir)) {
    fs.mkdirSync(examDir, { recursive: true });
  }

  subjects.forEach(sub => {
    const slug = slugify(sub);
    const subDir = path.join(examDir, slug);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    const syllabusPath = path.join(subDir, 'syllabus.json');
    const questionsPath = path.join(subDir, 'questions.json');

    if (!fs.existsSync(syllabusPath)) {
      fs.writeFileSync(syllabusPath, JSON.stringify({
        subject: sub,
        exam: exam.toUpperCase(),
        topics: ["Introduction to " + sub, "Advanced " + sub]
      }, null, 2));
    }

    if (!fs.existsSync(questionsPath)) {
      fs.writeFileSync(questionsPath, JSON.stringify({
        exam: exam.toUpperCase(),
        subject: sub,
        total: 0,
        questions: []
      }, null, 2));
    }
  });
}

createFolders('jamb', jambSubjects);
createFolders('bece', beceSubjects);

console.log('Folders created successfully');
