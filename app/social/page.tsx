"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PostComposer } from "@/components/social/PostComposer";
import { PostCard } from "@/components/social/PostCard";
import { SearchBar } from "@/components/social/SearchBar";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Post {
    id: string;
    content: string;
    postType: string;
    imageUrl?: string;
    hashtags: string[];
    createdAt: string;
    author: {
        id: string;
        name: string;
        image?: string;
        verified: boolean;
        verificationLevel: number;
    };
    likes: number;
    comments: number;
    shares: number;
}

const trendingTopics = [
    { topic: "New Education Policy Impact", count: "1,234 discussions" },
    { topic: "Future of Digital Payments", count: "987 discussions" },
    { topic: "Climate Change Resilience in Cities", count: "765 discussions" },
    { topic: "Rural Development Schemes", count: "543 discussions" },
    { topic: "AI in Governance", count: "421 discussions" },
];

export default function SocialPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [autoSeeded, setAutoSeeded] = useState(false);

    const seedDatabase = async () => {
        try {
            setSeeding(true);
            console.log("[Auto-Seed] Starting database seeding...");

            const response = await fetch("/api/seed-posts");
            const data = await response.json();

            if (data.success) {
                console.log("[Auto-Seed] Successfully seeded database with", data.data.postsCreated, "posts");
                setAutoSeeded(true);
                // Refresh posts after seeding
                await fetchPosts();
            } else {
                console.error("[Auto-Seed] Failed to seed database:", data.error);
            }
        } catch (err) {
            console.error("[Auto-Seed] Error seeding database:", err);
        } finally {
            setSeeding(false);
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/posts?limit=20");

            if (response.ok) {
                const data = await response.json();
                setPosts(data);

                // If no posts and haven't auto-seeded yet, seed automatically
                if (data.length === 0 && !autoSeeded && !seeding) {
                    console.log("[Auto-Seed] No posts found, auto-seeding database...");
                    await seedDatabase();
                }
            } else {
                // Check if it's a 404 (no posts) or actual error
                if (response.status === 404) {
                    setPosts([]);
                    // Auto-seed on 404 as well
                    if (!autoSeeded && !seeding) {
                        console.log("[Auto-Seed] 404 response, auto-seeding database...");
                        await seedDatabase();
                    }
                } else {
                    setError("Failed to load posts");
                }
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = () => {
        fetchPosts(); // Refresh feed
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Live Social & Community</h1>
                        <p className="text-gray-600">
                            Join fact-based discussions with verified users
                        </p>
                    </div>
                    <div className="bg-zintel-purple-dark text-white px-4 py-2 rounded-full text-sm font-medium">
                        Updated 30 mins ago
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex justify-center">
                    <SearchBar />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Post Composer */}
                    <PostComposer onPostCreated={handlePostCreated} />

                    {/* Verification Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-sm text-blue-800">
                            <span className="font-bold">🔒 Real-Person Verification:</span> All posts
                            are AI-moderated to ensure respectful language and factual content.
                        </p>
                    </div>

                    {/* Posts Feed */}
                    {loading || seeding ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-zintel-purple-dark" />
                            <span className="ml-3 text-gray-600">
                                {seeding ? "🌱 Setting up your feed with sample posts..." : "Loading posts..."}
                            </span>
                            {seeding && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Creating 10 engaging posts from Zintel.in
                                </p>
                            )}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                            <p className="text-red-800 font-semibold mb-2">{error}</p>
                            <p className="text-red-600 text-sm mb-4">
                                Make sure the development server is running
                            </p>
                            <button
                                onClick={fetchPosts}
                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No Posts Yet</h3>
                            <p className="text-gray-600 mb-6">
                                The social feed is empty. Seed the database with sample posts to get started!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                <a
                                    href="/api/seed-posts"
                                    target="_blank"
                                    className="px-6 py-3 bg-zintel-green text-white rounded-lg font-medium hover:bg-green-600 transition-colors inline-flex items-center gap-2"
                                >
                                    🌱 Seed Database
                                </a>
                                <span className="text-gray-500 text-sm">or</span>
                                <button
                                    onClick={() => (window.location.href = "/seed-database.html")}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                >
                                    Open Seeder Page
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                                <p className="text-sm text-gray-700">
                                    <strong>What you'll get:</strong> 10 engaging current affairs posts
                                    from the official Zintel.in account with realistic engagement numbers.
                                </p>
                            </div>
                        </div>
                    ) : (
                        posts.map((post) => <PostCard key={post.id} post={post} />)
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Trending Public Discussions */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-xl font-black mb-4">Trending Public Discussions</h2>

                        <div className="space-y-3">
                            {trendingTopics.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-gray-50 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                                >
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {item.topic}
                                    </h4>
                                    <p className="text-xs text-gray-500">{item.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Community Guidelines */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <h3 className="font-bold text-blue-900 mb-3">Community Guidelines</h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Share verified facts and cite sources</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Use respectful language at all times</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Respect diverse opinions and perspectives</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">✗</span>
                                <span>No fake news or misinformation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">✗</span>
                                <span>No personal attacks or abusive language</span>
                            </li>
                        </ul>
                        <p className="text-xs text-blue-700 mt-3 italic">
                            Violations may result in Truth ID downgrade
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
