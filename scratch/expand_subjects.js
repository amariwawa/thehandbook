const fs = require('fs');
const path = require('path');

const subjects = [
  "AGRICULTURAL SCIENCE", "ANIMAL HUSBANDRY (ALT A)", "ANIMAL HUSBANDRY (ALT B)",
  "APPLIED ELECTRICITY", "AUTO BODY REPAIRS AND SPRAY PAINTING", "AUTO ELECTRICAL WORK",
  "AUTO MECHANICAL WORK", "AUTO MECHANICS", "AUTO PARTS MERCHANDISING", "BASKETRY",
  "BIOLOGY", "BLOCKLAYING BRICKLAYING AND CONCRETING", "BOOK KEEPING", "BUILDING CONSTRUCTION",
  "BUSINESS MANAGEMENT", "CAPENTRY AND JOINERY", "CATERING CRAFT PRACTICE", "CERAMICS",
  "CHEMISTRY", "CHRISTIAN RELIGIOUS STUDIES (NEW)", "CIVIC EDUCATION", "CLERICAL OFFICE DUTIES",
  "CLOTHING AND TEXTILES", "COMMERCE", "COMPUTER STUDIES", "COSMETOLOGY",
  "CROP HUSBANDRY AND HORTICULTURE", "DATA PROCESSING", "DYEING & BLEACHING", "ECONOMICS",
  "EDO", "EFIK", "ELECTRICAL INSTALLATION AND MAINTENANCE WORK", "ELECTRONICS OR BASIC ELECTRONICS",
  "ENGLISH LANGUAGE", "FINANCIAL ACCOUNTING", "FINANCIAL ACCOUNTS", "FISHERIES (ALT A)",
  "FISHERIES (ALT B)", "FOODS AND NUTRITION", "FORESTRY", "FRENCH", "FURNITURE MAKING",
  "FURTHER MATHEMATICS OR MATHEMATICS (ELECTIVE)", "GARMENT MAKING", "GENERAL AGRICULTURE",
  "GENERAL KNOWLEDGE IN ART", "GENERAL MATHEMATICS OR MATHEMATICS (CORE)", "GEOGRAPHY",
  "GHANAIAN LANGUAGES", "GOVERNMENT", "GRAPHIC DESIGN", "GSM PHONES MAINTENANCE AND REPAIRS",
  "HAUSA", "HEALTH EDUCATION OR HEALTH SCIENCE", "HISTORY", "HOME MANAGEMENT", "IBIBIO",
  "IGBO", "INFORMATION AND COMMUNICATION TECHNOLOGY (CORE)", "INFORMATION AND COMMUNICATION TECHNOLOGY (ELECTIVE)",
  "INSURANCE", "INTEGRATED SCIENCE", "ISLAMIC RELIGIOUS STUDIES", "JEWELLERY", "LEATHER GOODS",
  "LEATHERWORK", "LITERATURE IN ENGLISH", "MACHINE WOODWORKING", "MARKETING", "METALWORK",
  "MINING", "MUSIC", "OFFICE PRACTICE", "PAINTING AND DECORATING", "PHOTOGRAPHY",
  "PHYSICAL EDUCATION", "PHYSICS", "PICTURE MAKING", "PLUMBING AND PIPE FITTING",
  "PRINCIPLES OF COST ACCOUNTING", "PRINTING CRAFT PRACTICE", "RADIO TELEVISION AND ELECTRONICS WORKS",
  "REFRIGERATION AND AIR CONDITIONING", "SALESMANSHIP", "SCULPTURE", "SHORTHAND",
  "SOCIAL STUDIES (NEW)", "STORE KEEPING", "STORE MANAGEMENT", "TECHNICAL DRAWING",
  "TEXTILES", "TOURISM", "TYPEWRITING", "UPHOLSTERY", "VISUAL ART",
  "WELDING AND FABRICATION ENGINEERING CRAFT PRACTICE", "WEST AFRICAN TRADITIONAL RELIGION",
  "WOODWORK", "ARABIC", "YORUBA"
];

const basePath = '/Users/macbookair/h@ndbook/data/syllabuses/waec';

subjects.forEach(subject => {
  const subjectSlug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const subjectDir = path.join(basePath, subjectSlug);

  if (!fs.existsSync(subjectDir)) {
    fs.mkdirSync(subjectDir, { recursive: true });
  }

  const syllabusPath = path.join(subjectDir, `waec_${subjectSlug}_syllabus.json`);
  const questionsPath = path.join(subjectDir, 'questions.json');

  const syllabusData = {
    exam: "WAEC",
    subject: subject,
    topics: [
      {
        title: "Introduction to " + subject,
        section: "General Principles",
        subtopics: ["Definition", "Importance", "Scope"]
      }
    ]
  };

  const questionsData = {
    exam: "WAEC",
    subject: subject,
    generated: "2026",
    total: 1,
    questions: [
      {
        id: 1,
        topic: "Introduction to " + subject,
        section: "General Principles",
        subtopic: "Definition",
        difficulty: "easy",
        question: `What is the primary focus of ${subject}?`,
        options: {
          "A": "Study of core concepts",
          "B": "Practical application",
          "C": "Historical background",
          "D": "All of the above"
        },
        answer: "D",
        explanation: "Comprehensive understanding involves multiple facets."
      }
    ]
  };

  fs.writeFileSync(syllabusPath, JSON.stringify(syllabusData, null, 2));
  fs.writeFileSync(questionsPath, JSON.stringify(questionsData, null, 2));
});

console.log(`Created structure for ${subjects.length} subjects.`);
