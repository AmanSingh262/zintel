"use client";

import { useState } from "react";
import { AlertTriangle, X, CheckCircle } from "lucide-react";
import { ZINTEL_COLORS } from "@/lib/constants/colors";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [reason, setReason] = useState("harassment");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-scale-in">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Report Content
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You</h4>
                            <p className="text-gray-500">
                                Your report has been submitted to our Safety Team. We review all reports within 24 hours to ensure respectful language.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p className="text-sm text-gray-600 mb-4">
                                Zintel is committed to maintaining a professional and respectful environment. Please select the issue you encountered:
                            </p>

                            <div className="space-y-3 mb-6">
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value="harassment"
                                        checked={reason === "harassment"}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Harassment or Hate Speech</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value="misinformation"
                                        checked={reason === "misinformation"}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Misinformation / Disputed Content</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value="bias"
                                        checked={reason === "bias"}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Political Bias / Non-Neutrality</span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: ZINTEL_COLORS.primary.purple }}
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
