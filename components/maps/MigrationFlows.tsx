"use client";

import { ZINTEL_COLORS } from "@/lib/constants/colors";

/**
 * Visualizes migration flows between states using SVG vectors
 */
export function MigrationFlows() {
    // Simplified map coordinates for key states (approximate relative positions)
    const locations: Record<string, { x: number; y: number; label: string }> = {
        DL: { x: 300, y: 150, label: "Delhi" },
        UP: { x: 380, y: 180, label: "UP" },
        BR: { x: 500, y: 200, label: "Bihar" },
        RJ: { x: 220, y: 200, label: "Rajasthan" },
        MH: { x: 250, y: 350, label: "Maharashtra" },
        GJ: { x: 180, y: 280, label: "Gujarat" },
        KA: { x: 280, y: 450, label: "Karnataka" },
        TN: { x: 320, y: 520, label: "Tamil Nadu" },
        WB: { x: 550, y: 250, label: "West Bengal" },
    };

    const flows = [
        { from: "UP", to: "MH", value: "High", color: "#ef4444" }, // UP -> Maharashtra
        { from: "BR", to: "DL", value: "High", color: "#ef4444" }, // Bihar -> Delhi
        { from: "RJ", to: "GJ", value: "Medium", color: "#f97316" }, // Rajasthan -> Gujarat
        { from: "WB", to: "KA", value: "Medium", color: "#f97316" }, // Bengal -> Karnataka
        { from: "UP", to: "DL", value: "High", color: "#ef4444" }, // UP -> Delhi
        { from: "BR", to: "MH", value: "Medium", color: "#f97316" }, // Bihar -> Maharashtra
    ];

    return (
        <div className="relative w-full h-[600px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-lg font-bold text-gray-900">Inter-State Migration Flows</h3>
                <p className="text-sm text-gray-500">Major labor movement corridors (2023-24)</p>
                <div className="flex gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-red-500"></div>
                        <span>High Volume Flow</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-orange-500"></div>
                        <span>Medium Volume Flow</span>
                    </div>
                </div>
            </div>

            {/* SVG Overlay */}
            <svg className="w-full h-full" viewBox="0 0 800 600">
                <defs>
                    <marker
                        id="arrowhead-high"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                    </marker>
                    <marker
                        id="arrowhead-medium"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                    </marker>
                </defs>

                {/* Draw Flows */}
                {flows.map((flow, i) => {
                    const start = locations[flow.from];
                    const end = locations[flow.to];

                    // Bezier curve control point (creates arch effect)
                    const midX = (start.x + end.x) / 2;
                    const midY = (start.y + end.y) / 2 - 50; // Curve upwards

                    return (
                        <g key={i}>
                            <path
                                d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
                                fill="none"
                                stroke={flow.color}
                                strokeWidth={flow.value === "High" ? 3 : 2}
                                markerEnd={`url(#arrowhead-${flow.value.toLowerCase()})`}
                                strokeDasharray={flow.value === "Medium" ? "5,5" : "none"}
                                className="animate-draw-line"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    from="1000"
                                    to="0"
                                    dur="2s"
                                    fill="freeze"
                                />
                            </path>
                        </g>
                    );
                })}

                {/* Draw Locations */}
                {Object.entries(locations).map(([key, loc]) => (
                    <g key={key}>
                        <circle
                            cx={loc.x}
                            cy={loc.y}
                            r="6"
                            fill="white"
                            stroke="#374151"
                            strokeWidth="2"
                        />
                        <text
                            x={loc.x}
                            y={loc.y + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="600"
                            fill="#374151"
                        >
                            {loc.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Background Map Shape (Abstract) */}
            <div className="absolute inset-0 pointer-events-none opacity-5 -z-10"
                style={{
                    backgroundImage: 'url(/images/india-outline.svg)', // Placeholder or rely on SVG illustration
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            ></div>
        </div>
    );
}
