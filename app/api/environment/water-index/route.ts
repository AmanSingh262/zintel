import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Fetching water scarcity index data...");

        // Mock state-wise water scarcity data
        const mockData = [
            { state: "Rajasthan", index: 85, status: "Critical" },
            { state: "Gujarat", index: 72, status: "High" },
            { state: "Maharashtra", index: 68, status: "High" },
            { state: "Karnataka", index: 55, status: "Moderate" },
            { state: "Tamil Nadu", index: 62, status: "Moderate" },
            { state: "Kerala", index: 28, status: "Low" },
            { state: "Punjab", index: 48, status: "Moderate" },
            { state: "Uttar Pradesh", index: 58, status: "Moderate" },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json([]);
    }
}
