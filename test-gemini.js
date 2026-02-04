// Test script to verify Gemini API configuration
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {
    console.log("=== Gemini API Test ===");
    console.log("1. Checking API Key...");

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ ERROR: GOOGLE_GEMINI_API_KEY is not set in .env.local");
        process.exit(1);
    }

    console.log("✓ API Key found:", apiKey.substring(0, 10) + "...");

    console.log("\n2. Initializing Gemini...");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("✓ Gemini initialized successfully");

        console.log("\n3. Testing simple text generation...");
        const result = await model.generateContent("Say 'Hello, Zintel!' in one word");
        const response = await result.response;
        const text = response.text();
        console.log("✓ API Response:", text);

        console.log("\n✅ SUCCESS: Gemini API is working correctly!");

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        if (error.message.includes("API key")) {
            console.error("\nThe API key appears to be invalid.");
            console.error("Get a new key from: https://makersuite.google.com/app/apikey");
        }
        process.exit(1);
    }
}

testGeminiAPI();
