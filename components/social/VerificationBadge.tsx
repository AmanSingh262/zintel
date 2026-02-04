"use client";

import { CheckCircle, Shield } from "lucide-react";

interface VerificationBadgeProps {
    level: number;
    verified: boolean;
}

export function VerificationBadge({ level, verified }: VerificationBadgeProps) {
    if (!verified || level === 0) return null;

    const colors = {
        1: "text-blue-600",
        2: "text-green-600",
    };

    return (
        <div className="flex items-center gap-1">
            <CheckCircle className={`w-4 h-4 ${colors[level as 1 | 2]} fill-current`} />
            {level === 2 && <Shield className="w-3 h-3 text-green-600" />}
        </div>
    );
}
