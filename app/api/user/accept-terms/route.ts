import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Find or create user in database
        const user = await prisma.user.upsert({
            where: { auth_user_id: userId },
            update: {
                termsAccepted: true,
                termsAcceptedAt: new Date(),
            },
            create: {
                auth_user_id: userId,
                email: "", // Will be updated from Supabase auth
                termsAccepted: true,
                termsAcceptedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("[Accept Terms] Error:", error);
        return NextResponse.json(
            { error: "Failed to accept terms" },
            { status: 500 }
        );
    }
}
