import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ModerationResult {
    isClean: boolean;
    reason?: string;
    confidence?: number;
}

export async function moderateContent(content: string): Promise<ModerationResult> {
    try {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

        if (!apiKey) {
            console.error("[AI Moderation] Gemini API key not found");
            // Fail open - allow content if AI is unavailable
            return { isClean: true };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a content moderator for Zintel.in, a platform for verified news and facts.

Analyze this comment and determine if it violates our "Respectful Language & Truth Integrity" policy.

Comment: "${content}"

Policy violations include:
- Abusive language, hate speech, or personal attacks
- Misinformation or deliberately false claims  
- Spam or promotional content
- Harassment or threats
- Profanity or vulgar language

Respond ONLY with valid JSON in this exact format:
{
  "isClean": true,
  "reason": "Content is respectful and appropriate"
}

OR if it violates:
{
  "isClean": false,
  "reason": "Brief explanation of violation",
  "confidence": 95
}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = response.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const moderation: ModerationResult = JSON.parse(jsonText);

        console.log("[AI Moderation]", {
            contentLength: content.length,
            isClean: moderation.isClean,
            reason: moderation.reason
        });

        return moderation;

    } catch (error) {
        console.error("[AI Moderation] Error:", error);
        // Fail open - allow content if moderation fails
        return {
            isClean: true,
            reason: "Moderation service temporarily unavailable"
        };
    }
}
