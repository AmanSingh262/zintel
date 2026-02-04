"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface UserSettings {
    email: string;
    name: string;
    phone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    appLanguage: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth/login");
                return;
            }

            setSettings({
                email: user.email || "",
                name: user.user_metadata?.name || "",
                phone: user.phone || "",
                emailVerified: user.email_confirmed_at !== null,
                phoneVerified: user.phone_confirmed_at !== null,
                appLanguage: "English",
            });
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setSaving(true);

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            setSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.message || "Failed to update password");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setSaving(true);
            // Note: Account deletion requires backend implementation
            alert("Account deletion feature coming soon. Please contact support.");
        } catch (err: any) {
            setError(err.message || "Failed to delete account");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading settings...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-8 space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Account Settings
                    </h1>
                    <p className="text-gray-600">
                        Manage your account security and preferences
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-600">
                        {success}
                    </div>
                )}

                {/* Account Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">
                        Account Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={settings?.email || ""}
                                    disabled
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                                />
                                {settings?.emailVerified && (
                                    <span className="text-green-600 font-semibold">✓ Verified</span>
                                )}
                            </div>
                        </div>

                        {settings?.phone && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        disabled
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                                    />
                                    {settings.phoneVerified && (
                                        <span className="text-green-600 font-semibold">✓ Verified</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">
                        Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !newPassword || !confirmPassword}
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>

                {/* Privacy & Security */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">
                        Privacy & Security
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                                <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                            <button className="px-4 py-2 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors">
                                Enable
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                                <p className="font-semibold text-gray-900">Login History</p>
                                <p className="text-sm text-gray-600">View recent login activity</p>
                            </div>
                            <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                                View
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-semibold text-gray-900">Active Sessions</p>
                                <p className="text-sm text-gray-600">Manage logged-in devices</p>
                            </div>
                            <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                                Manage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
                    <h2 className="text-2xl font-black text-red-600 mb-6">
                        Danger Zone
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Delete Account</p>
                                <p className="text-sm text-gray-600">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={saving}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
