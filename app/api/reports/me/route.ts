import { NextResponse } from "next/server";
import { getMyReports } from "@/lib/actions/reports";
import { headers } from "next/headers";

export async function GET(request: Request) {
    try {
        // Get user ID from session/auth header
        // For now, we'll get it from query params (replace with actual auth)
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 401 }
            );
        }

        const result = await getMyReports(userId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            reports: result.reports,
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
