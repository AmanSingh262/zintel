import { NextResponse } from "next/server";
import { mockStatePopulation } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching state population data...");
        return NextResponse.json(mockStatePopulation);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockStatePopulation);
    }
}
