import { NextResponse } from "next/server";
import { mockInflationData } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching inflation data...");
        return NextResponse.json(mockInflationData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockInflationData);
    }
}
