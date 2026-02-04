import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch user profile
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Find user by auth_user_id
        let user = await prisma.user.findUnique({
            where: { auth_user_id: userId },
        });

        // If user doesn't exist in database, create them
        if (!user) {
            const supabase = createServerClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            // Create user in database
            user = await prisma.user.create({
                data: {
                    auth_user_id: authUser.id,
                    email: authUser.email || "",
                    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User",
                    image: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
                },
            });
        }

        // Return safe profile data
        const profile = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            bio: user.bio,
            banner_url: (user as any).banner_url || null,
            location: (user as any).location || null,
            website: (user as any).website || null,
            truthIdVerified: user.truthIdVerified,
            verificationLevel: user.verificationLevel,
            preferredState: user.preferredState,
            topicsOfInterest: user.topicsOfInterest,
            createdAt: user.createdAt,
        };

        return NextResponse.json({ profile });
    } catch (error: any) {
        console.error("[User Profile] GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile", details: error.message },
            { status: 500 }
        );
    }
}

// POST - Update user profile
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, bio, location, website, image, banner_url } = body;

        // Validate bio length
        if (bio && bio.length > 160) {
            return NextResponse.json(
                { error: "Bio must be 160 characters or less" },
                { status: 400 }
            );
        }

        // Prepare update data (only include fields that exist in schema)
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (image !== undefined) updateData.image = image;

        // Try to update new fields if they exist
        try {
            if (location !== undefined) updateData.location = location;
            if (website !== undefined) updateData.website = website;
            if (banner_url !== undefined) updateData.banner_url = banner_url;
        } catch (e) {
            // Fields don't exist yet, skip them
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { auth_user_id: authUser.id },
            data: updateData,
        });

        return NextResponse.json({ profile: updatedUser });
    } catch (error: any) {
        console.error("[User Profile] POST error:", error);
        return NextResponse.json(
            { error: "Failed to update profile", details: error.message },
            { status: 500 }
        );
    }
}
