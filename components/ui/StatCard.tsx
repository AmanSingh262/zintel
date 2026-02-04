import { ReactNode } from "react";

interface StatCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    trend?: "up" | "down" | "neutral";
    icon?: ReactNode;
}

export function StatCard({ label, value, subtext, trend, icon }: StatCardProps) {
    const trendColors = {
        up: "text-verification-real",
        down: "text-verification-fake",
        neutral: "text-gray-500",
    };

    const trendIcons = {
        up: "↑",
        down: "↓",
        neutral: "→",
    };

    return (
        <div className="stat-card">
            <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-600">{label}</div>
                {icon && <div className="text-primary">{icon}</div>}
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>

            {(subtext || trend) && (
                <div className="flex items-center justify-between text-xs">
                    {trend && (
                        <span className={`flex items-center gap-1 font-medium ${trendColors[trend]}`}>
                            {trendIcons[trend]} {trend === "up" ? "Rising" : trend === "down" ? "High" : "Stable"}
                        </span>
                    )}
                    {subtext && <span className="text-gray-500">{subtext}</span>}
                </div>
            )}
        </div>
    );
}
