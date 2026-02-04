"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default function TermsPage() {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        try {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Update user's terms acceptance
            const response = await fetch("/api/user/accept-terms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });

            if (!response.ok) throw new Error("Failed to update terms");

            router.push("/");
        } catch (error) {
            console.error("Error accepting terms:", error);
            alert("Failed to accept terms. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-black text-gray-900 mb-6">
                    Respectful Language & Truth Integrity
                </h1>

                <div className="prose prose-sm max-w-none mb-8 space-y-4 text-gray-700">
                    <p>
                        Welcome to Zintel! To maintain a respectful and trustworthy
                        community, we ask all users to agree to the following guidelines:
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mt-6">
                        1. Respectful Communication
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Treat all community members with respect and dignity
                        </li>
                        <li>
                            No hate speech, harassment, or personal attacks
                        </li>
                        <li>
                            Avoid profanity and vulgar language
                        </li>
                        <li>
                            Engage in constructive discussions, even when disagreeing
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold text-gray-900 mt-6">
                        2. Truth & Accuracy
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Share only verified information from credible sources
                        </li>
                        <li>
                            Do not spread misinformation or deliberately false claims
                        </li>
                        <li>
                            Cite sources when sharing data or statistics
                        </li>
                        <li>
                            Report content that appears to be misleading
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold text-gray-900 mt-6">
                        3. Community Standards
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            No spam or promotional content
                        </li>
                        <li>
                            Respect intellectual property rights
                        </li>
                        <li>
                            Do not impersonate others
                        </li>
                        <li>
                            Report violations to maintain community integrity
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold text-gray-900 mt-6">
                        4. AI Moderation
                    </h3>
                    <p>
                        All comments and posts are screened by AI to ensure compliance with
                        these guidelines. Content that violates our policies will be
                        automatically flagged or removed.
                    </p>

                    <h3 className="text-lg font-bold text-gray-900 mt-6">
                        5. Consequences
                    </h3>
                    <p>
                        Violations may result in warnings, temporary suspensions, or
                        permanent account termination, depending on severity.
                    </p>
                </div>

                {/* Acceptance Checkbox */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-purple-50 rounded-xl">
                    <input
                        type="checkbox"
                        id="accept-terms"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label
                        htmlFor="accept-terms"
                        className="text-sm text-gray-700 cursor-pointer"
                    >
                        I have read and agree to the{" "}
                        <strong>Respectful Language & Truth Integrity</strong> Terms and
                        Conditions
                    </label>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleAccept}
                    disabled={!accepted || loading}
                    className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Continue to Zintel"}
                </button>
            </div>
        </div>
    );
}
