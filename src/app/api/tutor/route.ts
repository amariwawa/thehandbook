import { NextResponse } from 'next/server';
import { getTutorResponse } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { subject, topic, userMessage, examType } = await request.json();

    if (!subject || !topic || !userMessage || !examType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await getTutorResponse(subject, topic, userMessage, examType);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('API Error in tutor route:', error);
    return NextResponse.json({ 
      error: 'Failed to process request', 
      response: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!" 
    }, { status: 500 });
  }
}
