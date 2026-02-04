import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ProfileClient } from "./ProfileClient";

const prisma = new PrismaClient();

interface ProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    // Fetch user data
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            posts: {
                orderBy: { createdAt: 'desc' },
                take: 20,
                include: {
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    posts: true,
                    likes: true,
                    comments: true
                }
            }
        }
    });

    if (!user) {
        notFound();
    }

    // Transform data for client component
    const profileData = {
        id: user.id,
        name: user.name || "Unknown User",
        email: user.email,
        image: user.image,
        bio: user.bio,
        banner_url: user.banner_url,
        location: user.location,
        website: user.website,
        verificationLevel: user.verificationLevel,
        truthIdVerified: user.truthIdVerified,
        createdAt: user.createdAt.toISOString(),
        stats: {
            posts: user._count.posts,
            likes: user._count.likes,
            comments: user._count.comments
        },
        posts: user.posts.map(post => ({
            id: post.id,
            content: post.content,
            postType: post.postType,
            imageUrl: post.imageUrl,
            hashtags: post.hashtags,
            createdAt: post.createdAt.toISOString(),
            likes: post._count.likes,
            comments: post._count.comments
        }))
    };

    return <ProfileClient profile={profileData} />;
}
