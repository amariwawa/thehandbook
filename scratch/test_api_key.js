const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
  const apiKey = "AIzaSyDT8w0qvPf8ychvT-LrGDPpi76N_WatQf8";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, respond with 'SUCCESS' if you can read this.");
    const response = await result.response;
    const text = response.text();
    console.log("API Response:", text);
    if (text.includes("SUCCESS")) {
      console.log("--- KEY IS WORKING PERFECTLY ---");
    } else {
      console.log("--- KEY RETURNED AN UNEXPECTED RESPONSE ---");
    }
  } catch (error) {
    console.error("--- KEY FAILED ---");
    console.error("Error Message:", error.message);
    if (error.response) {
      console.error("Response Data:", JSON.stringify(error.response, null, 2));
    }
  }
}

testKey();
