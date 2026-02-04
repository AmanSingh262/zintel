"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

const TOPICS = [
    "Politics", "Technology", "Health", "Education", "Environment",
    "Economy", "Agriculture", "Infrastructure", "Social Welfare",
    "Science & Research", "Defense", "Sports", "Culture"
];

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showImageModal, setShowImageModal] = useState<'profile' | 'banner' | null>(null);
    const [tempImageUrl, setTempImageUrl] = useState("");
    const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                router.push("/auth/login");
                return;
            }

            setUser({
                id: authUser.id,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User",
                email: authUser.email,
                image: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
                banner: authUser.user_metadata?.banner_url,
                created_at: authUser.created_at,
            });

            setName(authUser.user_metadata?.name || authUser.email?.split('@')[0] || "");
            setBio(authUser.user_metadata?.bio || "");
            setProfileImage(authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || "");
            setBannerImage(authUser.user_metadata?.banner_url || "");

        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        try {
            setUploading(true);

            // Upload to Supabase Storage
            const bucket = type === 'profile' ? 'avatars' : 'banners';
            const publicUrl = await uploadImage(file, bucket, user.id);

            // Update local state
            setTempImageUrl(publicUrl);

            alert('Image uploaded successfully! Click "Update Image" to save.');
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);

            const { error } = await supabase.auth.updateUser({
                data: {
                    name: name,
                    bio: bio,
                    avatar_url: profileImage,
                    banner_url: bannerImage,
                }
            });

            if (error) throw error;

            alert("Profile updated successfully!");
            setIsEditing(false);
            loadUser();

            // Reload page to update header avatar
            window.location.reload();
        } catch (error: any) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpdate = (type: 'profile' | 'banner') => {
        if (type === 'profile') {
            setProfileImage(tempImageUrl);
        } else {
            setBannerImage(tempImageUrl);
        }
        setShowImageModal(null);
        setTempImageUrl("");
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-8">
                {/* Banner */}
                <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-500 via-purple-600 to-green-500 rounded-b-2xl overflow-hidden">
                    {bannerImage && (
                        <Image
                            src={bannerImage}
                            alt="Profile Banner"
                            fill
                            className="object-cover"
                        />
                    )}

                    {/* Change Banner Button */}
                    {isEditing && (
                        <button
                            onClick={() => {
                                setShowImageModal('banner');
                                setTempImageUrl(bannerImage);
                                setUploadMethod('file');
                            }}
                            className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-xl hover:bg-black/70 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-semibold">Change Banner</span>
                        </button>
                    )}
                </div>

                {/* Profile Header */}
                <div className="px-6 -mt-16 relative">
                    <div className="flex items-end justify-between">
                        {/* Avatar */}
                        <div className="relative">
                            {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt={user.name}
                                    width={128}
                                    height={128}
                                    className="rounded-full border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}

                            {/* Change Avatar Button */}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        setShowImageModal('profile');
                                        setTempImageUrl(profileImage);
                                        setUploadMethod('file');
                                    }}
                                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Edit Profile Button */}
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    handleSaveProfile();
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                            disabled={saving}
                            className="px-6 py-2 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="mt-4 space-y-3">
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="text-2xl font-black text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-2 w-full max-w-md focus:border-purple-500 focus:outline-none"
                            />
                        ) : (
                            <h1 className="text-2xl font-black text-gray-900">
                                {user.name || "User"}
                            </h1>
                        )}

                        <p className="text-gray-600">{user.email}</p>

                        {/* Bio */}
                        {isEditing ? (
                            <div>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                                    placeholder="Write a short bio (max 160 characters)"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                                    rows={3}
                                    maxLength={160}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {bio.length}/160 characters
                                </p>
                            </div>
                        ) : bio ? (
                            <p className="text-gray-700">{bio}</p>
                        ) : null}

                        {/* Member Since */}
                        <p className="text-sm text-gray-500">
                            📅 Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Content Preferences */}
                <div className="mt-8 mx-6 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">
                        Content Preferences
                    </h2>

                    {/* Preferred State */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Preferred State for News
                        </label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                        >
                            <option value="">Select a state...</option>
                            {INDIAN_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    {/* Topics of Interest */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Topics of Interest
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TOPICS.map(topic => (
                                <button
                                    key={topic}
                                    onClick={() => toggleTopic(topic)}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedTopics.includes(topic)
                                            ? "bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-lg"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Upload Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">
                            {showImageModal === 'profile' ? 'Change Profile Picture' : 'Change Banner Image'}
                        </h3>

                        {/* Upload Method Tabs */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setUploadMethod('file')}
                                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-colors ${uploadMethod === 'file'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                📁 Upload File
                            </button>
                            <button
                                onClick={() => setUploadMethod('url')}
                                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-colors ${uploadMethod === 'url'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                🔗 Use URL
                            </button>
                        </div>

                        <div className="space-y-4">
                            {uploadMethod === 'file' ? (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Choose Image from Device
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, showImageModal)}
                                        disabled={uploading}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 disabled:opacity-50"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Max size: 5MB • Formats: JPG, PNG, WebP
                                    </p>
                                    {uploading && (
                                        <div className="mt-3 flex items-center gap-2 text-purple-600">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                            <span className="text-sm font-semibold">Uploading...</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={tempImageUrl}
                                        onChange={(e) => setTempImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Paste a direct link to an image
                                    </p>
                                </div>
                            )}

                            {/* Preview */}
                            {tempImageUrl && (
                                <div className="relative">
                                    <p className="text-sm font-bold text-gray-700 mb-2">Preview:</p>
                                    {showImageModal === 'profile' ? (
                                        <Image
                                            src={tempImageUrl}
                                            alt="Preview"
                                            width={128}
                                            height={128}
                                            className="rounded-full mx-auto"
                                        />
                                    ) : (
                                        <div className="relative h-32 rounded-xl overflow-hidden">
                                            <Image
                                                src={tempImageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleImageUpdate(showImageModal)}
                                    disabled={!tempImageUrl || uploading}
                                    className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Update Image
                                </button>
                                <button
                                    onClick={() => {
                                        setShowImageModal(null);
                                        setTempImageUrl("");
                                    }}
                                    disabled={uploading}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
