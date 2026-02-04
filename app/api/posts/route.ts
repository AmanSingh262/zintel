import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// GET - Fetch posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = parseInt(searchParams.get("skip") || "0");

        const posts = await prisma.post.findMany({
            where: {
                moderationStatus: "approved"
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        truthIdVerified: true,
                        verificationLevel: true,
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },
                comments: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: limit,
            skip: skip
        });

        // Transform data
        const transformedPosts = posts.map(post => ({
            id: post.id,
            content: post.content,
            postType: post.postType,
            imageUrl: post.imageUrl,
            hashtags: post.hashtags,
            createdAt: post.createdAt,
            author: {
                id: post.author.id,
                name: post.author.name || "Anonymous",
                image: post.author.image,
                verified: post.author.truthIdVerified,
                verificationLevel: post.author.verificationLevel
            },
            likes: post.likes.length,
            comments: post.comments.length,
            shares: post.shares
        }));

        return NextResponse.json(transformedPosts);

    } catch (error: any) {
        console.error("[posts] GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// POST - Create post
export async function POST(request: NextRequest) {
    try {
        const { content, postType, aiSafetyScore, imageUrl } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        // Extract hashtags
        const hashtagRegex = /#(\w+)/g;
        const hashtags = [...content.matchAll(hashtagRegex)].map(match => match[1]);

        // Get user from Supabase auth
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: "Authentication required. Please sign in to post." },
                { status: 401 }
            );
        }

        // Extract token and verify with Supabase
        const token = authHeader.replace('Bearer ', '');

        // Import Supabase server client
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Invalid authentication token" },
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

        // Create post
        const post = await prisma.post.create({
            data: {
                content,
                postType: postType || "thought",
                authorId: user.id,
                moderationStatus: "approved",
                aiSafetyScore: aiSafetyScore || 100,
                imageUrl: imageUrl || null,
                hashtags: hashtags
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        truthIdVerified: true,
                        verificationLevel: true,
                    }
                }
            }
        });

        return NextResponse.json({
            id: post.id,
            content: post.content,
            postType: post.postType,
            imageUrl: post.imageUrl,
            hashtags: post.hashtags,
            createdAt: post.createdAt,
            author: {
                id: post.author.id,
                name: post.author.name || "Anonymous",
                image: post.author.image,
                verified: post.author.truthIdVerified,
                verificationLevel: post.author.verificationLevel
            },
            likes: 0,
            comments: 0,
            shares: 0
        });

    } catch (error: any) {
        console.error("[posts] POST error:", error);
        return NextResponse.json(
            { error: "Failed to create post", details: error.message },
            { status: 500 }
        );
    }
}
