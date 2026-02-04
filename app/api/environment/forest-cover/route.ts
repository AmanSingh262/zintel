import { NextResponse } from "next/server";
import { mockForestCover } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching forest cover data...");
        return NextResponse.json(mockForestCover);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockForestCover);
    }
}
