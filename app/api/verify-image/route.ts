import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        console.log("[verify-image] API endpoint called");

        // Read API key INSIDE the request handler (not at module load time)
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        console.log("[verify-image] API key present:", !!apiKey);

        // Check if API key is configured
        if (!apiKey || apiKey === "" || apiKey === "your-gemini-api-key-here") {
            console.error("[verify-image] API key not configured or invalid");
            return NextResponse.json(
                {
                    error: "Gemini API key is not configured. Please restart the server and ensure .env.local contains GOOGLE_GEMINI_API_KEY",
                    hint: "Get your API key from: https://makersuite.google.com/app/apikey"
                },
                { status: 500 }
            );
        }

        console.log("[verify-image] Initializing Gemini AI...");
        const genAI = new GoogleGenerativeAI(apiKey);

        const formData = await request.formData();
        const imageFile = formData.get("image") as File;

        if (!imageFile) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(imageFile.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPG, PNG, and WebP are supported." },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (imageFile.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 10MB limit" },
                { status: 400 }
            );
        }

        // Convert image to base64
        console.log("[verify-image] Converting image to base64, size:", imageFile.size, "bytes");
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");
        console.log("[verify-image] Base64 conversion complete");

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Forensic analysis prompt
        const prompt = `You are a Digital Forensic Expert analyzing images for authenticity and manipulation.

Analyze this image comprehensively for:

1. **EXIF Metadata Analysis:**
   - Check if EXIF data is intact and consistent
   - Verify date/time stamps are logical and sequential
   - Identify any metadata anomalies or tampering

2. **Tampering Detection:**
   - Analyze for pixel-level manipulation (cloning, splicing, copy-paste)
   - Detect lighting and shadow inconsistencies
   - Identify compression artifacts or quality mismatches
   - Look for edge artifacts or blending errors
   - Check for unnatural color gradients

3. **AI-Generated Content Detection:**
   - Assess probability of AI generation (deepfake, synthetic media)
   - Identify typical AI generation artifacts
   - Analyze for contextual inconsistencies
   - Check for anatomical or physical impossibilities

**CRITICAL: You MUST respond with ONLY valid JSON in this exact format:**

{
  "metadataAnalysis": {
    "status": "pass" | "fail" | "warning",
    "exifIntact": true | false,
    "dateTimeConsistency": true | false,
    "findings": ["finding 1", "finding 2", ...]
  },
  "tamperingDetection": {
    "status": "pass" | "fail" | "warning",
    "confidence": 0-100,
    "techniques": ["technique 1", "technique 2", ...],
    "artifacts": ["artifact 1", "artifact 2", ...]
  },
  "aiContextualAnalysis": {
    "status": "pass" | "fail" | "warning",
    "aiGenerated": true | false,
    "deepfakeIndicators": ["indicator 1", "indicator 2", ...],
    "contextualIssues": ["issue 1", "issue 2", ...]
  }
}

Rules:
- status must be "pass" (authentic), "fail" (manipulated/fake), or "warning" (suspicious)
- confidence is 0-100 (percentage)
- All arrays should contain specific, detailed findings
- If no issues found, use empty arrays []
- Be thorough and specific in your analysis`;

        // Generate analysis
        console.log("[verify-image] Calling Gemini API with image...");
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: imageFile.type,
                    data: base64Image,
                },
            },
        ]);
        console.log("[verify-image] Gemini API call completed");

        const response = await result.response;
        const text = response.text();
        console.log("[verify-image] Response received, length:", text.length);

        // Parse JSON response
        let analysisResult;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            analysisResult = JSON.parse(jsonText);
        } catch (parseError) {
            console.error("[verify-image] Failed to parse JSON. First 500 chars:", text.substring(0, 500));
            return NextResponse.json(
                { error: "Failed to parse analysis result. The AI response was not in the expected JSON format." },
                { status: 500 }
            );
        }

        console.log("[verify-image] Returning successful analysis result");
        return NextResponse.json(analysisResult);

    } catch (error: any) {
        console.error("[verify-image] ERROR:", error.message);
        console.error("[verify-image] Full error:", error);

        // Handle specific errors
        if (error.message?.includes("API key")) {
            return NextResponse.json(
                { error: "Invalid Gemini API key. Please check your .env.local file and restart the server." },
                { status: 401 }
            );
        }

        if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            return NextResponse.json(
                { error: "API rate limit exceeded. Please wait a few minutes and try again." },
                { status: 429 }
            );
        }

        if (error.message?.includes("fetch") || error.message?.includes("network")) {
            return NextResponse.json(
                { error: "Network error connecting to Gemini API. Please check your internet connection." },
                { status: 503 }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to analyze image. Please try again.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
