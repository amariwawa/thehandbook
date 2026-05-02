const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "../.env.local" });

async function test() {
  console.log("Key:", process.env.GOOGLE_AI_API_KEY);
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the Handbook AI Tutor..."
    });

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1000 },
    });

    const result = await chat.sendMessage([{ text: "hello" }]);
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) console.error(error.response);
  }
}
test();
