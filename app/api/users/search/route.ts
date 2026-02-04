import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Search users by name or email
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json([]);
        }

        // Search users by name or email (case-insensitive)
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                verificationLevel: true,
                truthIdVerified: true,
                bio: true
            },
            take: 10 // Limit to 10 results
        });

        return NextResponse.json(users);

    } catch (error: any) {
        console.error("[users/search] GET error:", error);
        return NextResponse.json(
            { error: "Failed to search users" },
            { status: 500 }
        );
    }
}
