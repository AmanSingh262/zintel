"use client";

import { ZINTEL_COLORS } from "@/lib/constants/colors";

interface CentralStateToggleProps {
    viewMode: "central" | "state";
    onToggle: (mode: "central" | "state") => void;
    className?: string;
}

/**
 * Universal Toggle Switch for Central (National) vs State-wise Data
 * Features animated background and clear status indication
 */
export function CentralStateToggle({ viewMode, onToggle, className = "" }: CentralStateToggleProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className={`text-sm font-semibold transition-colors ${viewMode === 'central' ? 'text-gray-900' : 'text-gray-500'}`}>
                Central Data
            </span>

            <button
                onClick={() => onToggle(viewMode === 'central' ? 'state' : 'central')}
                className="relative h-8 w-16 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                    backgroundColor: viewMode === 'central' ? '#e5e7eb' : ZINTEL_COLORS.primary.green
                }}
                aria-label="Toggle between Central and State data"
            >
                <div
                    className="h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out"
                    style={{
                        transform: viewMode === 'central' ? 'translateX(0)' : 'translateX(32px)'
                    }}
                />
            </button>

            <span className={`text-sm font-semibold transition-colors ${viewMode === 'state' ? 'text-gray-900' : 'text-gray-500'}`}>
                State-wise
            </span>
        </div>
    );
}
