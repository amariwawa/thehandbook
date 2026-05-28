import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exam = searchParams.get('exam');
  const subject = searchParams.get('subject');
  const topic = searchParams.get('topic');
  const count = parseInt(searchParams.get('count') || '50');

  if (!exam || !subject) {
    return NextResponse.json({ error: 'Exam and subject are required' }, { status: 400 });
  }

  const baseDir = path.join(process.cwd(), 'data general', 'syllabus.json', `${exam.toLowerCase()} syllabus`);
  
  if (!fs.existsSync(baseDir)) {
    console.error(`Syllabus directory not found at ${baseDir}`);
    return NextResponse.json({ error: 'Syllabus not found' }, { status: 404 });
  }

  // Find the subject folder inside baseDir dynamically
  const folders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);

  // Normalize requested subject ID (e.g., civic-education -> civic education, food-nutrition -> food nutrition)
  const normSubject = subject.toLowerCase().replace(/[-_]/g, ' ').trim();
  const subjectWords = normSubject.split(/\s+/);

  let bestMatch: string | null = null;
  let highestScore = 0;

  for (const folder of folders) {
    const normFolder = folder.toLowerCase().replace(/[-_]/g, ' ');
    
    // Check word overlap
    let score = 0;
    for (const word of subjectWords) {
      // Map common abbreviations / synonyms
      const variations = [word];
      if (word === 'math' || word === 'maths') variations.push('mathematics');
      if (word === 'mathematics') variations.push('math', 'maths');
      if (word === 'agric') variations.push('agriculture', 'agricultural');
      if (word === 'agriculture' || word === 'agricultural') variations.push('agric');
      if (word === 'nut') variations.push('nutrition');
      if (word === 'nutrition') variations.push('nut');
      if (word === 'pe' || word === 'phe') variations.push('physical', 'health', 'education');
      if (word === 'accounts') variations.push('accounting');
      if (word === 'accounting') variations.push('accounts');
      if (word === 'computer') variations.push('ict', 'information');
      if (word === 'science' && subjectWords.includes('computer')) variations.push('studies', 'craft');

      const matchesAny = variations.some(v => normFolder.includes(v));
      if (matchesAny) {
        score += 1;
      }
    }

    // Exact word matching bonus
    if (normFolder === normSubject || normFolder === `${exam.toLowerCase()} ${normSubject}`) {
      score += 10;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = folder;
    }
  }

  // fallback to direct folder check if score is 0
  if (highestScore === 0) {
    for (const folder of folders) {
      const normFolder = folder.toLowerCase();
      if (normFolder.includes(normSubject) || normSubject.includes(normFolder)) {
        bestMatch = folder;
        break;
      }
    }
  }

  if (!bestMatch) {
    console.error(`Could not match subject folder for ${exam}/${subject} in ${baseDir}`);
    return NextResponse.json({ error: 'Questions not found' }, { status: 404 });
  }

  const subjectDir = path.join(baseDir, bestMatch);
  const filePath = path.join(subjectDir, 'questions.json');

  if (!fs.existsSync(filePath)) {
    console.error(`Questions file not found at ${filePath}`);
    return NextResponse.json({ error: 'Questions not found' }, { status: 404 });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    let questions = data.questions || [];

    if (topic) {
      const lowerTopic = topic.toLowerCase();
      questions = questions.filter((q: any) => 
        q.topic?.toLowerCase().includes(lowerTopic) || 
        lowerTopic.includes(q.topic?.toLowerCase()) ||
        q.subtopic?.toLowerCase().includes(lowerTopic)
      );
    }

    // Shuffle and pick
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return NextResponse.json({ questions: selected });
  } catch (error) {
    console.error('Failed to load questions:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
