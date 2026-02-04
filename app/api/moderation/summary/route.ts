import { NextResponse } from "next/server";
import { getModerationSummary } from "@/lib/actions/reports";

export async function GET() {
    try {
        const result = await getModerationSummary();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result.stats);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
