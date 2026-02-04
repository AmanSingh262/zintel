import { NextResponse } from "next/server";
import { mockMigrationData } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching migration data...");
        return NextResponse.json(mockMigrationData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockMigrationData);
    }
}
