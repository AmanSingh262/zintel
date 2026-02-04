"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image?: string;
        truthIdVerified: boolean;
        verificationLevel: number;
    };
}

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
        loadComments();
    }, [postId]);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
    };

    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts/${postId}/comments`);
            const data = await response.json();

            if (data.comments) {
                setComments(data.comments);
            }
        } catch (err) {
            console.error("Error loading comments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        if (!isAuthenticated) {
            setError("Please log in to comment");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to post comment");
            }

            // Add new comment to list
            setComments([data.comment, ...comments]);
            setNewComment("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getVerificationBadge = (level: number) => {
        switch (level) {
            case 3:
                return <span className="text-blue-500" title="Level 3 Verified">✓✓✓</span>;
            case 2:
                return <span className="text-green-500" title="Level 2 Verified">✓✓</span>;
            case 1:
                return <span className="text-yellow-500" title="Level 1 Verified">✓</span>;
            default:
                return null;
        }
    };

    return (
        <div className="mt-6 space-y-4">
            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isAuthenticated ? "Share your thoughts..." : "Log in to comment"}
                    disabled={!isAuthenticated || submitting}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    rows={3}
                />

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!isAuthenticated || submitting || !newComment.trim()}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                    Comments ({comments.length})
                </h3>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {comment.user.image ? (
                                    <Image
                                        src={comment.user.image}
                                        alt={comment.user.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-bold">
                                        {comment.user.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">
                                        {comment.user.name || "Anonymous"}
                                    </span>
                                    {comment.user.truthIdVerified && getVerificationBadge(comment.user.verificationLevel)}
                                    <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-gray-700">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
