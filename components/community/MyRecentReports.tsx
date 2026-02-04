"use client";

import { useEffect, useState } from "react";

// Define ReportStatus enum locally for client component
enum ReportStatus {
    PENDING = "PENDING",
    UNDER_REVIEW = "UNDER_REVIEW",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED",
}

interface Report {
    id: string;
    type: string;
    title: string;
    description: string;
    status: ReportStatus;
    createdAt: string;
}

const statusConfig = {
    PENDING: { label: "Pending", color: "bg-gray-100 text-gray-800", icon: "ri-time-line" },
    UNDER_REVIEW: { label: "Under Review", color: "bg-amber-100 text-amber-800", icon: "ri-search-eye-line" },
    RESOLVED: { label: "Resolved", color: "bg-green-100 text-green-800", icon: "ri-checkbox-circle-line" },
    REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800", icon: "ri-close-circle-line" },
};

export function MyRecentReports({ userId }: { userId: string }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, [userId]);

    const fetchReports = async () => {
        try {
            const response = await fetch(`/api/reports/me?userId=${userId}`);
            const data = await response.json();
            setReports(data.reports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-2">My Recent Reports</h2>
            <p className="text-gray-600 mb-6">Track the status of your submitted reports.</p>

            {reports.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <i className="ri-file-list-3-line text-5xl mb-3 block"></i>
                    <p>You haven't submitted any reports yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => {
                        const status = statusConfig[report.status];
                        return (
                            <div
                                key={report.id}
                                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                                        <i className={status.icon}></i>
                                        {status.label}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <i className="ri-calendar-line"></i>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="ri-flag-line"></i>
                                        {report.type.replace(/_/g, " ")}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
