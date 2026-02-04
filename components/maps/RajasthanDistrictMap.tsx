"use client";

import { ZINTEL_COLORS } from "@/lib/constants/colors";
import { useState } from "react";

// Mock Data for Rajasthan Districts
// In a real app, this would come from a topojson file or API
// We will use a grid/hex representation for high-level visualization if geojson is unavailable
const DISTRICT_DATA = [
    { id: 'JP', name: 'Jaipur', scarcity: 'High', score: 78, row: 3, col: 4 },
    { id: 'JD', name: 'Jodhpur', scarcity: 'Critical', score: 92, row: 3, col: 2 },
    { id: 'UD', name: 'Udaipur', scarcity: 'Medium', score: 45, row: 5, col: 3 },
    { id: 'KT', name: 'Kota', scarcity: 'Low', score: 30, row: 5, col: 5 },
    { id: 'JS', name: 'Jaisalmer', scarcity: 'Critical', score: 95, row: 3, col: 1 },
    { id: 'BK', name: 'Bikaner', scarcity: 'Critical', score: 88, row: 2, col: 2 },
    { id: 'AJ', name: 'Ajmer', scarcity: 'High', score: 65, row: 3, col: 3 },
    { id: 'AL', name: 'Alwar', scarcity: 'High', score: 70, row: 2, col: 5 },
    { id: 'BH', name: 'Bharatpur', scarcity: 'High', score: 72, row: 2, col: 6 },
    { id: 'SG', name: 'Ganganagar', scarcity: 'Critical', score: 85, row: 1, col: 2 },
    { id: 'BM', name: 'Barmer', scarcity: 'Critical', score: 90, row: 4, col: 1 },
    { id: 'PL', name: 'Pali', scarcity: 'High', score: 68, row: 4, col: 2 },
    { id: 'CH', name: 'Churu', scarcity: 'Critical', score: 82, row: 2, col: 3 },
    { id: 'SI', name: 'Sikar', scarcity: 'High', score: 75, row: 2, col: 4 },
];

export function RajasthanDistrictMap() {
    const [hoveredDistrict, setHoveredDistrict] = useState<any>(null);

    const getColor = (scarcity: string) => {
        switch (scarcity) {
            case 'Critical': return '#991b1b'; // Dark Red
            case 'High': return '#ef4444'; // Red
            case 'Medium': return '#f97316'; // Orange
            case 'Low': return '#10b981'; // Green
            default: return '#e5e7eb';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6 relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Rajasthan Water Scarcity</h3>
                    <p className="text-sm text-gray-500">District-level granularity (Jan Suchna Portal 2024)</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 bg-red-800 rounded-full"></span> Critical
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span> High
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span> Low
                </div>
            </div>

            <div className="relative h-[400px] w-full flex items-center justify-center bg-orange-50/30 rounded-lg">
                <div
                    className="grid gap-2"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gridTemplateRows: 'repeat(6, 1fr)',
                        width: '90%',
                        height: '90%'
                    }}
                >
                    {DISTRICT_DATA.map((dist) => (
                        <div
                            key={dist.id}
                            className="rounded-md border border-white/50 shadow-sm flex items-center justify-center text-[10px] font-bold text-white transition-all hover:scale-110 cursor-pointer relative group"
                            style={{
                                gridRow: dist.row,
                                gridColumn: dist.col,
                                backgroundColor: getColor(dist.scarcity)
                            }}
                            onMouseEnter={() => setHoveredDistrict(dist)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                        >
                            {dist.id}

                            {/* Tooltip */}
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white p-2 rounded text-xs z-10 pointer-events-none">
                                <p className="font-bold">{dist.name}</p>
                                <p>Scarcity: {dist.scarcity}</p>
                                <p>Index: {dist.score}/100</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Background "Ghost" of Rajasthan Shape (Optional SVG) */}
                <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-[80%] h-[80%]">
                        <path d="M100,20 L140,40 L160,80 L150,140 L100,180 L50,150 L40,80 L60,40 Z" fill="#f97316" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
