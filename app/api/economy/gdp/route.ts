import { NextResponse } from "next/server";
import { mockGDPData } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching GDP data...");
        return NextResponse.json(mockGDPData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockGDPData);
    }
}
