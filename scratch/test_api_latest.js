const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testLatest() {
  const apiKey = "AIzaSyDT8w0qvPf8ychvT-LrGDPpi76N_WatQf8";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Testing gemini-flash-latest...");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Hello, respond with 'SUCCESS' if you can read this.");
    const response = await result.response;
    const text = response.text();
    console.log("API Response:", text);
    if (text.includes("SUCCESS")) {
      console.log("--- KEY IS WORKING PERFECTLY WITH GEMINI-FLASH-LATEST ---");
    }
  } catch (error) {
    console.error("FAILED with gemini-flash-latest:", error.message);
  }
}

testLatest();
