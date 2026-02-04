import { NextResponse } from "next/server";
import { mockDemographics } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching demographics data...");
        return NextResponse.json(mockDemographics);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockDemographics);
    }
}
