import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export async function getTutorResponse(subject: string, topic: string, userMessage: string, examType: string) {
  if (!apiKey) {
    return "I'm sorry, the AI tutor is not configured yet. Please add the GEMINI_API_KEY to the environment variables.";
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return null;
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ 
    model: "gemini-2.5-flash",
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
