"use client";

import { useState } from "react";
import { submitReport } from "@/lib/actions/reports";

// Define ReportType enum locally for client component
enum ReportType {
    FAKE_NEWS = "FAKE_NEWS",
    MISLEADING_IMAGE = "MISLEADING_IMAGE",
    ABUSIVE_CONTENT = "ABUSIVE_CONTENT",
}

export function ReportNewIssue({ userId }: { userId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState<ReportType | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (type: ReportType) => {
        if (!title || !description) {
            setMessage({ type: "error", text: "Please fill in all fields" });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const result = await submitReport({
                userId,
                type,
                title,
                description,
            });

            if (result.success) {
                setMessage({ type: "success", text: "Report submitted successfully!" });
                setTitle("");
                setDescription("");
                setSelectedType(null);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to submit report" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const reportTypes = [
        {
            type: ReportType.FAKE_NEWS,
            icon: "📰",
            label: "Report Misinformation",
            description: "Found disputed content or misleading news?",
        },
        {
            type: ReportType.MISLEADING_IMAGE,
            icon: "🖼️",
            label: "Report Misleading Image",
            description: "Found a doctored or misleading image?",
        },
        {
            type: ReportType.ABUSIVE_CONTENT,
            icon: "⚠️",
            label: "Report Abusive Content",
            description: "Found hate speech or abusive content?",
        },
    ];

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-2">Report New Issue</h2>
            <p className="text-gray-600 mb-6">Help us maintain truth by reporting misleading content.</p>

            {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-4 mb-6">
                {reportTypes.map(({ type, icon, label, description }) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${selectedType === type
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                            }`}
                    >
                        <span className="text-3xl">{icon}</span>
                        <div className="text-left flex-1">
                            <div className="font-semibold text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{description}</div>
                        </div>
                        <i className={`ri-arrow-${selectedType === type ? "up" : "down"}-s-line text-xl`}></i>
                    </button>
                ))}
            </div>

            {selectedType && (
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Brief description of the issue"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Detailed Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Provide details about what you found..."
                        />
                    </div>

                    <button
                        onClick={() => handleSubmit(selectedType)}
                        disabled={isSubmitting}
                        className="btn-primary w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            )}
        </div>
    );
}
