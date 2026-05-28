import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const exam = searchParams.get('exam') || 'waec';

  if (!subject) {
    return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
  }

  try {
    const examFolder = `${exam.toLowerCase()} syllabus`;
    const examFolderPath = path.join(process.cwd(), 'data general', 'syllabus.json', examFolder);
    
    // List all directories in the exam folder
    const dirs = await fs.readdir(examFolderPath);
    
    // Normalize function to remove spaces and special chars
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Handle 'maths' vs 'mathematics'
    const subjectNormalized = normalize(subject.replace('maths', 'mathematics'));
    
    // Find the matching directory
    let matchedDir = dirs.find(dir => {
      const cleanedDir = dir.toLowerCase()
        .replace(/^waec\s+/, '')
        .replace(/^jamb\s+/, '')
        .replace(/^bece\s+/, '')
        .replace(/\s+syllabus$/, '')
        .trim();
      return normalize(cleanedDir) === subjectNormalized;
    });
    
    if (!matchedDir) {
      // Fallback to contains
      matchedDir = dirs.find(dir => normalize(dir).includes(subjectNormalized));
    }
    
    if (!matchedDir) {
      console.error(`No directory found for subject: ${subject} in ${exam}`);
      return NextResponse.json({ 
        topics: ["Foundational Principles", "Advanced Concepts", "Core Theories", "Practice Assessment"] 
      });
    }

    const filePath = path.join(examFolderPath, matchedDir, 'syllabus.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const syllabus = JSON.parse(fileContent);
    
    // Recursive function to extract topics from any structure
    const extractTopics = (obj: any): string[] => {
      let result: string[] = [];
      
      if (typeof obj !== 'object' || obj === null) return result;
      
      // If it's an array, process each item
      if (Array.isArray(obj)) {
        obj.forEach(item => {
          result = [...result, ...extractTopics(item)];
        });
        return result;
      }
      
      // If it has a 'topics' array, process it
      if (obj.topics && Array.isArray(obj.topics)) {
        obj.topics.forEach((t: any) => {
          if (typeof t === 'string') {
            result.push(t);
          } else if (t.title) {
            result.push(t.title);
          } else if (t.topic) {
            result.push(t.topic);
          }
        });
      }
      
      // Recursively check all object properties
      for (const key in obj) {
        if (key !== 'topics' && typeof obj[key] === 'object') {
          result = [...result, ...extractTopics(obj[key])];
        }
      }
      
      return result;
    };
    
    let topics = extractTopics(syllabus);
    
    // Clean up topics (remove duplicates and empty strings)
    topics = Array.from(new Set(topics.map(t => t.trim()).filter(t => t)));
    
    // Fallback if no topics found
    if (topics.length === 0) {
      topics = ["Foundational Principles", "Advanced Concepts", "Core Theories", "Final Assessment"];
    }

    return NextResponse.json({ topics });
  } catch (error) {
    console.error(`Failed to load syllabus for ${subject} in ${exam}:`, error);
    return NextResponse.json({ 
      topics: ["Foundational Principles", "Advanced Concepts", "Core Theories", "Practice Assessment"] 
    });
  }
}
