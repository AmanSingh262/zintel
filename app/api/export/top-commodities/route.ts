import { NextResponse } from "next/server";
import { mockTopCommodities } from "@/lib/mockData";

export async function GET() {
    try {
        console.log("Fetching top commodities data...");
        return NextResponse.json(mockTopCommodities);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(mockTopCommodities);
    }
}
