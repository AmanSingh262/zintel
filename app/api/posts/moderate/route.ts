import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        console.log("[moderate-post] API endpoint called");

        const { content, userId } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        // Read API key
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        console.log("[moderate-post] API key present:", !!apiKey);

        if (!apiKey || apiKey === "" || apiKey === "your-gemini-api-key-here") {
            console.error("[moderate-post] API key not configured");
            return NextResponse.json(
                { error: "AI moderation service not configured" },
                { status: 500 }
            );
        }

        console.log("[moderate-post] Initializing Gemini AI...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Moderation prompt
        const prompt = `You are a content moderation AI for Zintel, a fact-based social platform.

Analyze this post for:
1. **Abusive Language**: Hate speech, slurs, personal attacks, offensive language
2. **Spam**: Purely promotional, irrelevant, repetitive content
3. **Misinformation**: Obviously false claims without sources
4. **Respectful Language**: Does it maintain civil discourse?

Post Content: "${content}"

Respond with ONLY valid JSON in this exact format:
{
  "approved": true,
  "safetyScore": 95,
  "reason": "",
  "categories": [],
  "suggestion": ""
}

Rules:
- approved: false if ANY violation detected (abusive language, spam, hate speech)
- safetyScore: 100 = perfectly safe, 0 = severe violation
- reason: Brief explanation if rejected (e.g., "Contains abusive language")
- categories: Array of violations like ["abusive", "spam", "misinformation"]
- suggestion: How to improve the post if rejected
- Be strict on abusive language and hate speech
- Constructive criticism and fact-based debate are allowed
- Political opinions are allowed if respectful`;

        console.log("[moderate-post] Calling Gemini API for moderation...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("[moderate-post] Response received, length:", text.length);

        // Parse JSON response
        let moderation;
        try {
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            moderation = JSON.parse(jsonText);
            console.log("[moderate-post] Moderation result:", moderation);
        } catch (parseError) {
            console.error("[moderate-post] Failed to parse JSON:", text.substring(0, 500));
            return NextResponse.json(
                { error: "AI moderation service error" },
                { status: 500 }
            );
        }

        // Ensure proper structure
        const result_data = {
            approved: moderation.approved === true,
            safetyScore: moderation.safetyScore || 0,
            reason: moderation.reason || "",
            categories: moderation.categories || [],
            suggestion: moderation.suggestion || ""
        };

        console.log("[moderate-post] Returning moderation result");
        return NextResponse.json(result_data);

    } catch (error: any) {
        console.error("[moderate-post] ERROR:", error.message);
        console.error("[moderate-post] Full error:", error);

        return NextResponse.json(
            {
                error: "Failed to moderate content. Please try again.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
