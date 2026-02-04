import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Like/Unlike a post
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = id;
    try {
        // Get user from Supabase auth
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
            return NextResponse.json(
                { error: "Invalid authentication" },
                { status: 401 }
            );
        }

        // Find or create user in database
        let user = await prisma.user.findUnique({
            where: { auth_user_id: authUser.id }
        });

        if (!user) {
            // Auto-create user if doesn't exist
            user = await prisma.user.create({
                data: {
                    auth_user_id: authUser.id,
                    email: authUser.email!,
                    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                    image: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
                    emailVerified: false,
                    verificationLevel: 0,
                    termsAccepted: true,
                    termsAcceptedAt: new Date(),
                }
            });
        }

        // const postId = params.id; // Removed, already got from awaited params

        // Check if already liked (composite key is userId_postId in schema)
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: postId
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });

            // Get updated count
            const likeCount = await prisma.like.count({
                where: { postId }
            });

            return NextResponse.json({ liked: false, count: likeCount });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    postId,
                    userId: user.id
                }
            });

            // Get updated count
            const likeCount = await prisma.like.count({
                where: { postId }
            });

            return NextResponse.json({ liked: true, count: likeCount });
        }

    } catch (error: any) {
        console.error("[like] POST error:", error);
        return NextResponse.json(
            { error: "Failed to like/unlike post" },
            { status: 500 }
        );
    }
}
