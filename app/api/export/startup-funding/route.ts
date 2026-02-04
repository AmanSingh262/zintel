import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Fetching startup funding data...");

        // Mock data for startup funding by category
        const mockData = [
            { category: "Fintech", count: 245, amount: 2300, color: "#fbbf24" },
            { category: "E-Commerce", count: 189, amount: 1850, color: "#f97316" },
            { category: "EdTech", count: 156, amount: 980, color: "#fb923c" },
            { category: "HealthTech", count: 134, amount: 1200, color: "#f87171" },
            { category: "AgriTech", count: 98, amount: 650, color: "#fb7185" },
            { category: "SaaS", count: 178, amount: 1450, color: "#e879f9" },
            { category: "CleanTech", count: 87, amount: 520, color: "#c084fc" },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json([]);
    }
}
