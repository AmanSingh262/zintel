import { NextResponse } from "next/server";
import { mockWaterQuality } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching water quality data...");
        return NextResponse.json(mockWaterQuality);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockWaterQuality);
    }
}
