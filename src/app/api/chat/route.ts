import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiDirect(messages: any[]) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                 process.env.GOOGLE_AI_API_KEY || 
                 process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("API Key missing from server environment.");

  // Format messages for direct Google API
  const history = messages.slice(0, -1).map((msg: any) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content || "" }]
  }));

  const lastMessage = messages[messages.length - 1];
  const payload = {
    contents: [
      ...history,
      {
        role: "user",
        parts: [{ text: lastMessage.content || "" }]
      }
    ],
    system_instruction: {
      parts: [{ text: "You are the Handbook AI Tutor, a premium academic assistant for Nigerian students. Your tone is academic, encouraging, and clear. CRITICAL: Use perfect spelling and grammar. DO NOT use hashtags (###) or headers. Just speak in clean, professional paragraphs." }]
    },
    generationConfig: {
      maxOutputTokens: 1000,
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

      return data.candidates[0].content.parts[0].text;
    } catch (err: any) {
      console.error(`Direct Attempt ${i + 1} Failed:`, err.message);
      if (i === retries - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const text = await callGeminiDirect(messages);

    return NextResponse.json({ 
      role: "assistant", 
      content: text,
      time: `SENT ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "AI Connection Error", 
      details: error.message 
    }, { status: 500 });
  }
}
