"use client";

import { Heart, MessageCircle, Share2, MoreVertical, Trash2, Edit, X, Instagram } from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import { CommentModal } from "./CommentModal";
import { useState, useRef, useEffect } from "react";

interface PostCardProps {
    post: {
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
    };
    onUpdate?: () => void;
    onDelete?: (postId: string) => void;
    isOwner?: boolean;
}

export function PostCard({ post, onUpdate, onDelete, isOwner: isOwnerProp }: PostCardProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [commentCount, setCommentCount] = useState(post.comments);
    const [shareCount, setShareCount] = useState(post.shares);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isGeneratingCard, setIsGeneratingCard] = useState(false);

    // Edit/Delete state
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOwner, setIsOwner] = useState(isOwnerProp ?? false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Check ownership
    useEffect(() => {
        if (isOwnerProp !== undefined) {
            setIsOwner(isOwnerProp);
        } else {
            const checkOwner = async () => {
                const { supabase } = await import('@/lib/supabase/client');
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: dbUser } = await supabase
                        .from('User')
                        .select('auth_user_id')
                        .eq('id', post.author.id)
                        .single();

                    if (dbUser?.auth_user_id === user.id) {
                        setIsOwner(true);
                    }
                }
            };
            checkOwner();
        }

        // Close menu on outside click
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [post.author.id, isOwnerProp]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setIsDeleting(true);
        try {
            const { supabase } = await import('@/lib/supabase/client');
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return;

            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                if (onDelete) onDelete(post.id);
                if (onUpdate) onUpdate(); // Refresh feed if generic update
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting post");
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const { supabase } = await import('@/lib/supabase/client');
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return;

            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: editContent })
            });

            if (response.ok) {
                post.content = editContent; // Optimistic update
                setIsEditing(false);
                if (onUpdate) onUpdate();
            } else {
                alert("Failed to update post");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating post");
        }
    };

    // Fixed Like handler with real API call
    const handleLike = async () => {
        // Optimistic UI update
        const newLiked = !liked;
        const newCount = newLiked ? likeCount + 1 : likeCount - 1;
        setLiked(newLiked);
        setLikeCount(newCount);

        try {
            // Get Supabase session token
            const { supabase } = await import('@/lib/supabase/client');
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setLiked(!newLiked);
                setLikeCount(likeCount);
                console.error("Not authenticated");
                return;
            }

            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
            });

            if (!response.ok) {
                // Get detailed error
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error("Failed to like post:", response.status, errorData);

                // Revert on error
                setLiked(!newLiked);
                setLikeCount(likeCount);
            } else {
                // Update with actual count from server
                const data = await response.json();
                setLiked(data.liked);
                setLikeCount(data.count);
            }
        } catch (error) {
            // Revert on error
            setLiked(!newLiked);
            setLikeCount(likeCount);
            console.error("Error liking post:", error);
        }
    };

    // Fixed Comment handler
    const handleComment = () => {
        setShowComments(true);
    };

    const handleCommentAdded = () => {
        setCommentCount(commentCount + 1);
        if (onUpdate) onUpdate();
    };

    // Share handler with menu
    const handleShare = () => {
        setShowShareMenu(!showShareMenu);
    };

    // Instagram Stories card generator
    const generateInstagramCard = async () => {
        setIsGeneratingCard(true);

        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Set canvas size for Instagram Stories (1080x1920)
            canvas.width = 1080;
            canvas.height = 1920;

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "#2e008b");
            gradient.addColorStop(1, "#8b5cf6");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Zintel Logo
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 80px Manrope, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("ZINTEL", canvas.width / 2, 150);

            ctx.font = "30px Manrope, sans-serif";
            ctx.fillText("GEN-Z'S UNFILTERED NEWS & FACTS", canvas.width / 2, 210);

            // Post Content Box
            const boxPadding = 60;
            const boxY = 350;
            const boxHeight = 800;

            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.beginPath();
            ctx.roundRect(boxPadding, boxY, canvas.width - boxPadding * 2, boxHeight, 30);
            ctx.fill();

            // Author Info
            ctx.fillStyle = "#1f2937";
            ctx.font = "bold 36px Manrope, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(post.author.name, boxPadding + 40, boxY + 80);

            // Post Content (wrapped text)
            ctx.fillStyle = "#374151";
            ctx.font = "32px Manrope, sans-serif";

            const maxWidth = canvas.width - boxPadding * 2 - 80;
            const lineHeight = 50;
            const words = post.content.split(" ");
            let line = "";
            let y = boxY + 150;

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + " ";
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth && i > 0) {
                    ctx.fillText(line, boxPadding + 40, y);
                    line = words[i] + " ";
                    y += lineHeight;

                    if (y > boxY + boxHeight - 150) {
                        ctx.fillText("...", boxPadding + 40, y);
                        break;
                    }
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, boxPadding + 40, y);

            // Engagement Stats
            y = boxY + boxHeight - 80;
            ctx.fillStyle = "#6b7280";
            ctx.font = "28px Manrope, sans-serif";
            ctx.fillText(`❤️ ${likeCount}   💬 ${commentCount}   🔗 ${shareCount}`, boxPadding + 40, y);

            // Footer
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 40px Manrope, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Verified Facts. Real Data.", canvas.width / 2, 1700);

            ctx.font = "32px Manrope, sans-serif";
            ctx.fillText("Download Zintel App", canvas.width / 2, 1780);

            // Convert to blob and share
            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], "zintel-fact.png", { type: "image/png" });

                // Try Web Share API (works on mobile)
                if (navigator.share) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: "Zintel Fact",
                            text: post.content.substring(0, 100),
                        });

                        setShareCount(shareCount + 1);
                    } catch (error) {
                        console.log("Share cancelled:", error);
                        downloadImage(blob);
                    }
                } else {
                    downloadImage(blob);
                }

                setIsGeneratingCard(false);
                setShowShareMenu(false);
            }, "image/png");
        } catch (error) {
            console.error("Error generating Instagram card:", error);
            setIsGeneratingCard(false);
        }
    };

    const downloadImage = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `zintel-fact-${post.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    const renderContent = () => {
        const parts = post.content.split(/(#\w+)/g);
        return parts.map((part, index) => {
            if (part.startsWith("#")) {
                return (
                    <span key={index} className="text-zintel-purple-dark font-medium">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow relative">
            {/* Hidden canvas for Instagram card generation */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {post.author.image ? (
                            <img
                                src={post.author.image}
                                alt={post.author.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            "👤"
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                            <VerificationBadge
                                level={post.author.verificationLevel}
                                verified={post.author.verified}
                            />
                        </div>
                        <p className="text-sm text-gray-500">{getTimeAgo(post.createdAt)}</p>
                    </div>

                    {post.postType === "intelligence" && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Intelligence
                        </span>
                    )}
                </div>

                {/* Edit/Delete Menu - Only for Owner */}
                {(isOwner || isOwnerProp) && (
                    <div className="flex items-center gap-2" ref={menuRef}>
                        {/* DEBUG: Direct actions */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 text-gray-700 font-bold"
                        >
                            EDIT
                        </button>

                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Menu clicked");
                                    setShowMenu(!showMenu);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 border border-red-200"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Post
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        disabled={isDeleting}
                                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium"
                                    >
                                        {isDeleting ? (
                                            <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-gray-800 mb-4 leading-relaxed whitespace-pre-wrap">
                        {renderContent()}
                    </p>
                    {/* Tags */}
                    {post.hashtags && post.hashtags.length > 0 && ( // Added null/undefined check for hashtags
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.hashtags.map((tag, idx) => (
                                <span key={idx} className="text-purple-600 hover:underline cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Post Image */}
            {post.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 relative">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${liked ? "text-purple-600" : "text-gray-600 hover:text-purple-600"
                        }`}
                >
                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">{likeCount}</span>
                </button>

                <button
                    onClick={handleComment}
                    className="flex items-center gap-2 text-gray-600 hover:text-zintel-purple-dark transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{commentCount}</span>
                </button>

                <div className="relative">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-gray-600 hover:text-zintel-purple-dark transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{shareCount}</span>
                    </button>

                    {/* Share Menu */}
                    {showShareMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[220px]">
                            <button
                                onClick={generateInstagramCard}
                                disabled={isGeneratingCard}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <Instagram className="w-5 h-5 text-pink-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {isGeneratingCard ? "Generating..." : "Share to Instagram Stories"}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        window.location.origin + `/post/${post.id}`
                                    );
                                    setShowShareMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors text-left"
                            >
                                <Share2 className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Copy Link</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comment Modal */}
            <CommentModal
                postId={post.id}
                isOpen={showComments}
                onClose={() => setShowComments(false)}
                onCommentAdded={handleCommentAdded}
            />
        </div>
    );
}
