const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testFlash2() {
  const apiKey = "AIzaSyDT8w0qvPf8ychvT-LrGDPpi76N_WatQf8";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Testing gemini-2.0-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello, respond with 'SUCCESS' if you can read this.");
    const response = await result.response;
    const text = response.text();
    console.log("API Response:", text);
    if (text.includes("SUCCESS")) {
      console.log("--- KEY IS WORKING PERFECTLY WITH GEMINI 2.0 FLASH ---");
    }
  } catch (error) {
    console.error("FAILED with gemini-2.0-flash:", error.message);
  }
}

testFlash2();
