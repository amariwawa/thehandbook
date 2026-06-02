import { GoogleGenerativeAI } from "@google/generative-ai";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
  if (!key) {
    console.error("[gemini.ts] No GEMINI_API_KEY or GOOGLE_AI_API_KEY found in environment.");
  }
  return key;
}

export async function getTutorResponse(subject: string, topic: string, userMessage: string, examType: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "AI Tutor is offline: GEMINI_API_KEY is missing. Add it to your .env.local (local) or Vercel Environment Variables (production).";
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are an expert AI tutor for Nigerian secondary school students preparing for the ${examType.toUpperCase()} exam. 
  Your goal is to help them understand topics in ${subject}, specifically relating to ${topic}. 
  Be encouraging, clear, and use examples familiar to Nigerian students where appropriate. 
  Keep your answers concise and educational.`;

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am ready to assist Nigerian students as an expert tutor." }] }
      ]
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Failed to get tutor response:', error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
}

export async function generateQuestion(subject: string, topic: string, examType: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[gemini.ts] GEMINI_API_KEY is missing — cannot generate question.");
    return null;
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `Generate a high-quality multiple-choice question for a Nigerian student preparing for the ${examType.toUpperCase()} exam in ${subject}, topic: ${topic}.
  The JSON structure MUST be:
  {
    "question": "string",
    "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
    "answer": "A" | "B" | "C" | "D",
    "explanation": "Detailed explanation"
  }`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to generate question:', error);
    return null;
  }
}
