"use client";

import { useState, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { VerificationBadge } from "./VerificationBadge";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image?: string;
        verificationLevel: number;
        truthIdVerified: boolean;
    };
}

interface CommentModalProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
    onCommentAdded?: () => void;
}

export function CommentModal({ postId, isOpen, onClose, onCommentAdded }: CommentModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            loadComments();
        }
    }, [isOpen, postId]);

    const loadComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (response.ok) {
                const data = await response.json();
                // API returns { comments: [...] }
                setComments(data.comments || data);
            }
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                alert("Please sign in to comment");
                return;
            }

            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                setNewComment("");
                loadComments();
                onCommentAdded?.();
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to post comment");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleProfileClick = (userId: string) => {
        router.push(`/profile/${userId}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-black text-gray-900">Comments</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                {/* Avatar - Clickable */}
                                <button
                                    onClick={() => handleProfileClick(comment.user.id)}
                                    className="flex-shrink-0"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-purple-600 transition-all">
                                        {comment.user.image ? (
                                            <img
                                                src={comment.user.image}
                                                alt={comment.user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            comment.user.name?.charAt(0).toUpperCase() || "?"
                                        )}
                                    </div>
                                </button>

                                {/* Comment Content */}
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-2xl px-4 py-3">
                                        {/* Username - Clickable */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <button
                                                onClick={() => handleProfileClick(comment.user.id)}
                                                className="font-black text-gray-900 hover:text-purple-600 transition-colors"
                                            >
                                                @{comment.user.name || "unknown"}
                                            </button>
                                            <VerificationBadge
                                                level={comment.user.verificationLevel}
                                                verified={comment.user.truthIdVerified}
                                            />
                                        </div>
                                        <p className="text-gray-800">{comment.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 ml-4">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-purple-600 transition-colors"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
