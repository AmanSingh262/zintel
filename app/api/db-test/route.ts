import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Test database connection
export async function GET(request: NextRequest) {
    try {
        console.log("[db-test] Testing database connection...");

        // Test 1: Check if we can connect
        await prisma.$connect();
        console.log("[db-test] ✓ Database connected");

        // Test 2: Count users
        const userCount = await prisma.user.count();
        console.log(`[db-test] ✓ Found ${userCount} users`);

        // Test 3: Count posts
        const postCount = await prisma.post.count();
        console.log(`[db-test] ✓ Found ${postCount} posts`);

        // Test 4: Get all posts
        const posts = await prisma.post.findMany({
            include: {
                author: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            connection: "OK",
            stats: {
                users: userCount,
                posts: postCount,
            },
            posts: posts.map(p => ({
                id: p.id,
                content: p.content.substring(0, 50) + "...",
                author: p.author.name,
                likes: p._count.likes,
                comments: p._count.comments,
            }))
        });

    } catch (error: any) {
        console.error("[db-test] Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.toString(),
        }, { status: 500 });
    }
}
