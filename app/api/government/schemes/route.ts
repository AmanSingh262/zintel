import { NextResponse } from "next/server";
import { mockSchemePerformance } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching scheme performance data...");
        return NextResponse.json(mockSchemePerformance);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockSchemePerformance);
    }
}
