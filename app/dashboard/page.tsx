"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Mail, Calendar, Shield, Settings, LogOut, CheckCircle, Edit } from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    truthIdVerified: boolean;
    image?: string;
    bio?: string;
    createdAt: string;
    lastLogin?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({ name: "", bio: "" });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem("auth_token");

            if (!token) {
                router.push("/auth/signin");
                return;
            }

            const response = await fetch("/api/user/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load profile");
            }

            const data = await response.json();
            setUserData(data.user);
            setEditData({ name: data.user.name, bio: data.user.bio || "" });
        } catch (error) {
            console.error("Error loading profile:", error);
            localStorage.removeItem("auth_token");
            router.push("/auth/signin");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        router.push("/auth/signin");
    };

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const data = await response.json();
            setUserData(data.user);
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!userData) return null;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {userData.name}!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <div className="text-center">
                                {/* Avatar */}
                                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                    {userData.name?.charAt(0).toUpperCase()}
                                </div>

                                {/* Name & Email */}
                                <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                                <p className="text-gray-600 text-sm mb-3">{userData.email}</p>

                                {/* Verification Badge */}
                                {userData.truthIdVerified && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-verification-real/10 text-verification-real rounded-full text-sm font-medium mb-4">
                                        <CheckCircle className="w-4 h-4" />
                                        Verified Account
                                    </div>
                                )}

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-primary rounded-full text-xs font-semibold uppercase mb-6">
                                    <Shield className="w-3.5 h-3.5" />
                                    {userData.role}
                                </div>

                                {/* Quick Stats */}
                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Member Since</span>
                                        <span className="font-medium">
                                            {new Date(userData.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {userData.lastLogin && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Last Login</span>
                                            <span className="font-medium">
                                                {new Date(userData.lastLogin).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                    <button
                                        onClick={() => setEditing(!editing)}
                                        className="w-full btn btn-primary flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full btn btn-outline flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Edit Profile */}
                        {editing && (
                            <div className="card bg-purple-50 border-primary/20">
                                <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            value={editData.bio}
                                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleSaveProfile} className="btn btn-primary">
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="btn btn-outline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Information */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Account Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="font-medium">Email Address</div>
                                        <div className="text-sm text-gray-600">{userData.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <User className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="font-medium">Full Name</div>
                                        <div className="text-sm text-gray-600">{userData.name}</div>
                                    </div>
                                </div>
                                {userData.bio && (
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <div className="font-medium">Bio</div>
                                            <div className="text-sm text-gray-600">{userData.bio}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity Summary */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Activity Summary</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-600">0</div>
                                    <div className="text-sm text-gray-600 mt-1">Posts</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">0</div>
                                    <div className="text-sm text-gray-600 mt-1">Comments</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-3xl font-bold text-purple-600">0</div>
                                    <div className="text-sm text-gray-600 mt-1">Likes</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-purple-50 transition-all text-left">
                                    <Settings className="w-6 h-6 text-primary mb-2" />
                                    <div className="font-medium">Settings</div>
                                    <div className="text-xs text-gray-600">Manage preferences</div>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-purple-50 transition-all text-left">
                                    <Shield className="w-6 h-6 text-primary mb-2" />
                                    <div className="font-medium">Truth ID</div>
                                    <div className="text-xs text-gray-600">Verify your identity</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
