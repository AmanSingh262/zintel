import { NextResponse } from "next/server";
import { mockQuickStats } from "@/lib/mockData";

export async function GET() {
    try {
        // For production, fetch from data.gov.in
        // For now, return mock data
        console.log("Fetching quick stats...");

        return NextResponse.json(mockQuickStats);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockQuickStats);
    }
}
