import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { moderateContent } from "@/lib/ai/moderateContent";
import { getServerUser } from "@/lib/supabase/server";

// GET - Fetch comments for a post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = id;
    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
                is_flagged: false, // Only show non-flagged comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        truthIdVerified: true,
                        verificationLevel: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ comments });
    } catch (error: any) {
        console.error("[Comments] GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST - Create new comment with AI moderation
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = id;
    try {
        const { content } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            );
        }

        // Get authenticated user from Authorization header
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const token = authHeader.replace('Bearer ', '');

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            console.error("Auth error:", authError);
            return NextResponse.json(
                { error: "Invalid authentication token" },
                { status: 401 }
            );
        }

        // Find user in database
        const dbUser = await prisma.user.findUnique({
            where: { auth_user_id: authUser.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found in database" },
                { status: 404 }
            );
        }

        // AI Moderation
        console.log("[Comment Moderation] Checking content:", content.substring(0, 50));
        let moderationResult = { isClean: true, reason: "" };

        try {
            const result = await moderateContent(content);
            moderationResult = result;
        } catch (modError) {
            console.error("Moderation error, allowing comment:", modError);
            // Fail open logic
        }

        if (!moderationResult.isClean) {
            console.log("[Comment Moderation] Content flagged:", moderationResult.reason);
            return NextResponse.json(
                {
                    error: "Your comment violates our Respectful Language policy",
                    reason: moderationResult.reason,
                },
                { status: 400 }
            );
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId: postId,
                userId: dbUser.id,
                is_flagged: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        truthIdVerified: true,
                        verificationLevel: true,
                    },
                },
            },
        });

        console.log("[Comment] Created successfully:", comment.id);

        return NextResponse.json({ comment });
    } catch (error: any) {
        console.error("[Comments] POST error:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
