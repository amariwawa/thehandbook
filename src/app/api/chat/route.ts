import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiDirect(messages: any[]) {
  const apiKey = process.env.GEMINI_API_KEY ||
                 process.env.GOOGLE_AI_API_KEY ||
                 process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[api/chat] No GEMINI_API_KEY, GOOGLE_AI_API_KEY, or NEXT_PUBLIC_GEMINI_API_KEY found in server environment.");
    throw new Error("AI Tutor is offline: GEMINI_API_KEY is missing. Add it to your .env.local (local) or Vercel Environment Variables (production).");
  }

  // Helper to format messages with attachments for direct Google API
  const formatMessageParts = (msg: any) => {
    const parts: any[] = [];

    if (msg.content) {
      parts.push({ text: msg.content });
    }

    if (msg.attachments && Array.isArray(msg.attachments)) {
      for (const attachment of msg.attachments) {
        if (attachment.type === 'photo' || attachment.type === 'file') {
          if (attachment.data && attachment.mimeType) {
            // Strip any browser data URL prefix (e.g., "data:image/png;base64,")
            const base64Data = attachment.data.replace(/^data:[^;]+;base64,/, "");
            parts.push({
              inlineData: {
                mimeType: attachment.mimeType,
                data: base64Data
              }
            });
          }
        } else if (attachment.type === 'link') {
          parts.push({ text: `\n[Attached Link: ${attachment.name}]` });
        }
      }
    }

    // Enforce at least one part for Gemini API schema validity
    if (parts.length === 0) {
      parts.push({ text: "" });
    }

    return parts;
  };

  const history = messages.slice(0, -1).map((msg: any) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: formatMessageParts(msg)
  }));

  const lastMessage = messages[messages.length - 1];
  const payload = {
    contents: [
      ...history,
      {
        role: "user",
        parts: formatMessageParts(lastMessage)
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let retries = 3;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `Google API Error ${response.status}`);

      return data.candidates[0].content.parts[0].text;
    } catch (err: any) {
      console.error(`[api/chat] Direct Attempt ${i + 1} Failed:`, err.message);
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
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Internal server error during chat";
    return NextResponse.json({ 
      error: "AI Connection Error", 
      details: errMessage 
    }, { status: 500 });
  }
}
