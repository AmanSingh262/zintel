"use client";

import { useEffect, useState, useRef } from "react";
import india from "@svg-maps/india";
import budgetApi from "@/lib/budget-api";

interface WaterIndexData {
    state: string;
    index: number;
    status: string;
}

// Water scarcity data by state (index out of 100)
const waterScarcityData: Record<string, number> = {
    "Rajasthan": 85,
    "Gujarat": 78,
    "Maharashtra": 72,
    "Karnataka": 68,
    "Tamil Nadu": 75,
    "Andhra Pradesh": 70,
    "Telangana": 73,
    "Haryana": 80,
    "Punjab": 65,
    "Uttar Pradesh": 60,
    "Madhya Pradesh": 55,
    "Delhi": 82,
    "Goa": 35,
    "Kerala": 30,
    "West Bengal": 42,
    "Bihar": 48,
    "Jharkhand": 52,
    "Odisha": 45,
    "Chhattisgarh": 40,
    "Assam": 25,
    "Meghalaya": 20,
    "Tripura": 28,
    "Mizoram": 22,
    "Manipur": 26,
    "Nagaland": 24,
    "Arunachal Pradesh": 18,
    "Sikkim": 15,
    "Uttarakhand": 38,
    "Himachal Pradesh": 32,
    "Jammu and Kashmir": 36,
    "Ladakh": 50,
};

function getWaterStressColor(index: number): string {
    if (index >= 80) return "#dc2626"; // Critical - red-600
    if (index >= 60) return "#f97316"; // High - orange-500
    if (index >= 40) return "#fbbf24"; // Moderate - yellow-400
    return "#14b8a6"; // Low - teal-500
}

function getWaterStressLabel(index: number): string {
    if (index >= 80) return "Critical";
    if (index >= 60) return "High";
    if (index >= 40) return "Moderate";
    return "Low";
}

export function WaterScarcityMap() {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [data, setData] = useState<WaterIndexData[]>([]);
    const [loading, setLoading] = useState(true);

    const REFRESH_MS = 20 * 60 * 1000; // 20 minutes

    useEffect(() => {
        let isMounted = true;
        let timer: NodeJS.Timeout | undefined;

        const run = async () => {
            await fetchData(isMounted);
            timer = setInterval(() => fetchData(isMounted), REFRESH_MS);
        };

        run();

        return () => {
            isMounted = false;
            if (timer) clearInterval(timer);
        };
    }, []);

    const fetchData = async (isMounted: boolean = true) => {
        try {
            const response = await fetch(budgetApi.environmentWaterScarcity());
            const result = await response.json();
            if (!isMounted) return;
            
            const transformedData: WaterIndexData[] = result.data.map((item: any) => ({
                state: item.state,
                index: item.scarcity_index * 10, // Convert to 0-100 scale
                status: item.severity
            }));
            
            setData(transformedData);
        } catch (error) {
            console.error("Error fetching water index data:", error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-green-500 p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
                    <div className="h-64 sm:h-96 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const locations = (india as any).locations || [];
    const viewBox = (india as any).viewBox || "0 0 1000 1000";

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-orange-500 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-base sm:text-xl font-black uppercase">Water Scarcity Index by State</h3>
                <span className="text-xs sm:text-sm font-semibold text-orange-600 bg-orange-100 px-2 sm:px-3 py-1 rounded-full w-fit">
                    2024 Data
                </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Visual representation of water stress levels across different Indian states.
            </p>

            {/* Map Container */}
            <div className="relative bg-slate-950 rounded-xl overflow-hidden">
                <div className="aspect-[16/10] w-full">
                    <svg
                        viewBox={viewBox}
                        className="w-full h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <filter id="waterGlow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Render all states */}
                        {locations.map((location: any, idx: number) => {
                            const stateName = typeof location.name === "string" ? location.name : "";
                            const waterIndex = waterScarcityData[stateName] || 50;
                            const fillColor = getWaterStressColor(waterIndex);
                            const isHovered = hoveredState === stateName;

                            return (
                                <g key={idx}>
                                    <path
                                        d={location.path}
                                        fill={fillColor}
                                        stroke="#0f172a"
                                        strokeWidth={isHovered ? 3 : 1.5}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        opacity={isHovered ? 1 : 0.85}
                                        style={{
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            filter: isHovered ? "url(#waterGlow)" : "none"
                                        }}
                                        onMouseEnter={() => setHoveredState(stateName)}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                </g>
                            );
                        })}

                        {/* Hover tooltip */}
                        {hoveredState && (
                            <g>
                                <rect
                                    x="50"
                                    y="50"
                                    width="350"
                                    height="95"
                                    fill="#1e293b"
                                    stroke="#64748b"
                                    strokeWidth="2"
                                    rx="8"
                                    opacity="0.95"
                                />
                                <text
                                    x="225"
                                    y="90"
                                    textAnchor="middle"
                                    fill="#f1f5f9"
                                    fontSize="24"
                                    fontWeight="700"
                                >
                                    {hoveredState}
                                </text>
                                <text
                                    x="225"
                                    y="120"
                                    textAnchor="middle"
                                    fill="#cbd5e1"
                                    fontSize="18"
                                >
                                    Water Stress: {waterScarcityData[hoveredState] || 50}% - {getWaterStressLabel(waterScarcityData[hoveredState] || 50)}
                                </text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* Legend - Mobile Optimized */}
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-[9px] sm:text-xs shadow-lg max-w-[140px] sm:max-w-none">
                    <div className="font-semibold mb-1 sm:mb-2 text-slate-900 text-[10px] sm:text-xs">Water Stress</div>
                    <div className="space-y-0.5 sm:space-y-1.5">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-red-600 rounded flex-shrink-0"></div>
                            <span className="text-slate-700 leading-tight">Critical (&gt;80%)</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-orange-500 rounded flex-shrink-0"></div>
                            <span className="text-slate-700 leading-tight">High (60-80%)</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-yellow-400 rounded flex-shrink-0"></div>
                            <span className="text-slate-700 leading-tight">Mod (40-60%)</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-teal-500 rounded flex-shrink-0"></div>
                            <span className="text-slate-700 leading-tight">Low (&lt;40%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500">
                Data from 2023/2024 • Hover over states for details
            </div>
        </div>
    );
}
