import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateDirect(subject: string, topic: string, count: number) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                 process.env.GOOGLE_AI_API_KEY || 
                 process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("API Key missing.");

  const prompt = `
    Generate ${count} high-quality MCQs for ${subject} (${topic || 'General'}).
    Return ONLY a JSON array of objects with keys: id, topic, question, options (object with A,B,C,D), answer (A/B/C/D), explanation.
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.3
    }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  let retries = 3;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Google API Error");

      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (err: any) {
      if (i === retries - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
}

export async function POST(req: Request) {
  try {
    const { subject, topic, count = 5 } = await req.json();
    const questions = await generateDirect(subject, topic, count);
    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ error: "AI Generation Error", details: error.message }, { status: 500 });
  }
}
