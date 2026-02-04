"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, Heart, MessageCircle } from "lucide-react";
import { VerificationBadge } from "@/components/social/VerificationBadge";
import { PostComposer } from "@/components/social/PostComposer";
import { PostCard } from "@/components/social/PostCard";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    image?: string;
    bio?: string;
    banner_url?: string;
    location?: string;
    website?: string;
    verificationLevel: number;
    truthIdVerified: boolean;
    createdAt: string;
    stats: {
        posts: number;
        likes: number;
        comments: number;
    };
    posts: Array<{
        id: string;
        content: string;
        postType: string;
        imageUrl?: string;
        hashtags: string[];
        createdAt: string;
        likes: number;
        comments: number;
    }>;
}

interface ProfileClientProps {
    profile: ProfileData;
}

export function ProfileClient({ profile }: ProfileClientProps) {
    const router = useRouter();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const checkOwner = async () => {
            const { supabase } = await import('@/lib/supabase/client');
            const { data: { user } } = await supabase.auth.getUser();

            console.log("Checking ownership:");
            console.log("Auth User Email:", user?.email);
            console.log("Profile Email:", profile.email);
            console.log("Profile ID:", profile.id);

            // Robust check: Compare emails since IDs might be from different tables (Auth vs Public)
            if (user && (user.email === profile.email || profile.id === "me")) {
                console.log("Ownership Verified!");
                setIsOwner(true);
            } else {
                console.log("Ownership Failed");
            }
        };
        checkOwner();
    }, [profile.email, profile.id]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-black text-xl flex items-center gap-2">
                            {profile.name}
                            {isOwner && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                    OWNER MODE
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-gray-500">{profile.stats.posts} posts</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Banner */}
                <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600">
                    {profile.banner_url && (
                        <img
                            src={profile.banner_url}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Profile Info */}
                <div className="bg-white px-6 pb-6">
                    {/* Avatar */}
                    <div className="flex justify-between items-start -mt-16 mb-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full border-4 border-white flex items-center justify-center text-white text-4xl font-black">
                            {profile.image ? (
                                <img
                                    src={profile.image}
                                    alt={profile.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                profile.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                    {/* Name & Verification */}
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-black text-2xl text-gray-900">{profile.name}</h2>
                        <VerificationBadge
                            level={profile.verificationLevel}
                            verified={profile.truthIdVerified}
                        />
                    </div>

                    <p className="text-gray-500 mb-4">@{profile.email.split('@')[0]}</p>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="text-gray-800 mb-4">{profile.bio}</p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        {profile.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-purple-600 hover:underline"
                            >
                                <LinkIcon className="w-4 h-4" />
                                <span>{profile.website}</span>
                            </a>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-sm">
                        <div>
                            <span className="font-black text-gray-900">{profile.stats.posts}</span>
                            <span className="text-gray-600 ml-1">Posts</span>
                        </div>
                        <div>
                            <span className="font-black text-gray-900">{profile.stats.likes}</span>
                            <span className="text-gray-600 ml-1">Likes</span>
                        </div>
                        <div>
                            <span className="font-black text-gray-900">{profile.stats.comments}</span>
                            <span className="text-gray-600 ml-1">Comments</span>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="p-6">
                    {/* Only show PostComposer if IS OWNER */}
                    {isOwner && (
                        <div className="mb-8">
                            <PostComposer onPostCreated={() => {
                                router.refresh();
                            }} />
                        </div>
                    )}

                    <h3 className="font-black text-xl mb-4">Posts</h3>

                    {profile.posts.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                            No posts yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {profile.posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={{
                                        ...post,
                                        author: {
                                            id: profile.id,
                                            name: profile.name,
                                            image: profile.image,
                                            verified: profile.truthIdVerified,
                                            verificationLevel: profile.verificationLevel
                                        },
                                        shares: 0
                                    }}
                                    onUpdate={() => router.refresh()}
                                    onDelete={() => router.refresh()}
                                    isOwner={isOwner}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
