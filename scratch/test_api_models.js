const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = "AIzaSyDT8w0qvPf8ychvT-LrGDPpi76N_WatQf8";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Note: The SDK doesn't always expose listModels directly on genAI,
    // but we can try to fetch them or try another common model name.
    console.log("Testing gemini-1.5-flash-latest...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("SUCCESS with gemini-1.5-flash-latest:", response.text());
  } catch (error) {
    console.error("FAILED with gemini-1.5-flash-latest:", error.message);
    
    try {
      console.log("Testing gemini-pro...");
      const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
      const resultPro = await modelPro.generateContent("Hi");
      const responsePro = await resultPro.response;
      console.log("SUCCESS with gemini-pro:", responsePro.text());
    } catch (errorPro) {
      console.error("FAILED with gemini-pro:", errorPro.message);
    }
  }
}

listModels();
