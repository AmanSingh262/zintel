import { NextResponse } from "next/server";
import { mockEmploymentData } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching employment data...");
        return NextResponse.json(mockEmploymentData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockEmploymentData);
    }
}
