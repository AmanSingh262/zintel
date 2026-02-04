import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Fetching MSME contribution data...");

        // Mock data for MSME sector distribution
        const mockData = [
            { name: "Micro", value: 45, color: "#14b8a6" },
            { name: "Small", value: 32, color: "#8b5cf6" },
            { name: "Medium", value: 23, color: "#f59e0b" },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json([]);
    }
}
