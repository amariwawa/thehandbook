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

  const baseDir = path.join(process.cwd(), 'data general', 'data', 'syllabuses', exam.toLowerCase(), subject.toLowerCase());
  
  function findQuestionsFile(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;
    const directPath = path.join(dir, 'questions.json');
    if (fs.existsSync(directPath)) return directPath;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        const found = findQuestionsFile(path.join(dir, item.name));
        if (found) return found;
      }
    }
    return null;
  }

  const filePath = findQuestionsFile(baseDir);
  
  if (!filePath) {
    console.error(`Questions file not found for ${exam}/${subject} in ${baseDir}`);
    return NextResponse.json({ error: 'Questions not found' }, { status: 404 });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    let questions = data.questions || [];

    if (topic) {
      questions = questions.filter((q: any) => q.topic.toLowerCase() === topic.toLowerCase());
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
