import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE - Delete a post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = id;

    try {
        // Auth check
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user: authUser } } = await supabase.auth.getUser(token);

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.author.auth_user_id !== authUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete
        await prisma.post.delete({
            where: { id: postId }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}

// PATCH - Update a post
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = id;

    try {
        const { content } = await request.json();

        // Auth check
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user: authUser } } = await supabase.auth.getUser(token);

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.author.auth_user_id !== authUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { content }
        });

        return NextResponse.json(updatedPost);

    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}
