"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface PostComposerProps {
    onPostCreated: () => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState<"intelligence" | "thought">("thought");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setLoading(true);
        setError(null);
        let uploadedImageUrl: string | null = null;

        try {
            // Step 1: Moderate with AI (optional - fail open)
            console.log("Starting AI moderation...");
            let moderationResult: any = null;

            const moderationRes = await fetch("/api/posts/moderate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (moderationRes.ok) {
                moderationResult = await moderationRes.json();
                console.log("Moderation result:", moderationResult);

                if (!moderationResult.approved) {
                    setError(
                        `Your post was declined as it does not meet our Respectful Language guidelines. ${moderationResult.suggestion || moderationResult.reason}`
                    );
                    setLoading(false);
                    return;
                }
            } else {
                // Moderation failed, but allow post anyway
                console.warn("Moderation service unavailable, allowing post");
            }

            // Step 2: Upload image if present
            if (imageFile) {
                try {
                    setUploading(true);
                    const { data: { user } } = await supabase.auth.getUser();

                    if (user) {
                        const fileExt = imageFile.name.split('.').pop();
                        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                        const filePath = `${user.id}/${fileName}`;

                        const { data, error: uploadError } = await supabase.storage
                            .from('post-images')
                            .upload(filePath, imageFile, {
                                cacheControl: '3600',
                                upsert: false
                            });

                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = supabase.storage
                            .from('post-images')
                            .getPublicUrl(filePath);

                        uploadedImageUrl = publicUrl;
                    }
                } catch (uploadErr: any) {
                    console.error('Image upload error:', uploadErr);
                    setError('Failed to upload image: ' + uploadErr.message);
                    setLoading(false);
                    setUploading(false);
                    return;
                } finally {
                    setUploading(false);
                }
            }

            // Step 3: Create post
            console.log("Creating post...");

            // Get Supabase session token
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setError("Please sign in to create posts");
                setLoading(false);
                return;
            }

            const postRes = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    content,
                    postType,
                    aiSafetyScore: moderationResult?.safetyScore || 0,
                    imageUrl: uploadedImageUrl,
                }),
            });

            if (postRes.ok) {
                setContent("");
                setImageFile(null);
                setImagePreview(null);
                setError(null);
                onPostCreated();
            } else {
                const errorData = await postRes.json();
                setError(errorData.error || "Failed to create post");
            }
        } catch (err: any) {
            console.error("Post creation error:", err);
            setError(err.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* Post Type Selector */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setPostType("intelligence")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${postType === "intelligence"
                        ? "bg-zintel-purple-dark text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    Intelligence (News)
                </button>
                <button
                    onClick={() => setPostType("thought")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${postType === "thought"
                        ? "bg-zintel-purple-dark text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    Thoughts
                </button>
            </div>

            {/* Text Area */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start a new post..."
                className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-zintel-purple-dark transition-colors font-normal"
                rows={4}
                disabled={loading}
            />

            {/* Error Message */}
            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
                <div className="mt-4 relative">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 rounded-xl object-cover"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        disabled={loading}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="post-image-upload"
                        disabled={loading}
                    />
                    <label
                        htmlFor="post-image-upload"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                    </label>
                    {uploading && (
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading image...
                        </span>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !content.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-zintel-green text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Post
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
