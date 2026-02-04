import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Fetching trade balance data...");

        // Yearly deficit data for the chart
        const mockData = [
            { year: "2019", deficit: 156 },
            { year: "2020", deficit: 189 },
            { year: "2021", deficit: 234 },
            { year: "2022", deficit: 198 },
            { year: "2023", deficit: 176 },
            { year: "2024", deficit: 165 },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json([]);
    }
}
