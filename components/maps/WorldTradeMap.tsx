"use client";

export function WorldTradeMap() {
    const locations = {
        India: { x: 1420, y: 360, label: "India" },
        USA: { x: 444, y: 247, label: "USA" },
        UAE: { x: 1307, y: 309, label: "UAE" },
        China: { x: 1600, y: 300, label: "China" },
        EU: { x: 1022, y: 190, label: "EU" },
        Russia: { x: 1206, y: 162, label: "Russia" },
        Singapore: { x: 1577, y: 423, label: "Singapore" },
        Africa: { x: 1019, y: 397, label: "Nigeria" }, // Proxy for Africa trade
        Australia: { x: 1760, y: 700, label: "Australia" }
    };

    const tradeRoutes = [
        { to: "USA", type: "export", value: "High", color: "#10b981" }, // Export Surplus
        { to: "UAE", type: "trade", value: "High", color: "#f97316" }, // High Trade
        { to: "China", type: "import", value: "High", color: "#ef4444" }, // Import Heavy
        { to: "EU", type: "trade", value: "Medium", color: "#2e008b" },
        { to: "Russia", type: "import", value: "Medium", color: "#ef4444" }, // Oil Imports
        { to: "Singapore", type: "export", value: "Medium", color: "#10b981" },
        { to: "Africa", type: "export", value: "Medium", color: "#10b981" },
        { to: "Australia", type: "trade", value: "Medium", color: "#2e008b" }
    ];

    return (
        <div className="relative w-full h-[520px] bg-[#0a0f1a] rounded-xl overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-3 left-3 z-10 w-[240px] bg-slate-950/85 border border-slate-800 rounded-xl px-4 py-3 backdrop-blur-md shadow-lg">
                <h3 className="text-lg font-bold text-white leading-tight">Global Trade Intelligence</h3>
                <p className="text-xs text-slate-300 mt-1">Top export-import corridors with live signals</p>
                <div className="flex flex-col gap-2 mt-3 text-xs text-slate-100">
                    <LegendDot color="#22c55e" label="Export dominant" />
                    <LegendDot color="#ef4444" label="Import dominant" />
                    <LegendDot color="#f97316" label="High volume" />
                </div>
            </div>

            <svg className="w-full h-full" viewBox="0 0 2000 857" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <rect x="0" y="0" width="2000" height="857" fill="#0a0f1a" />
                <image
                    href="/WorlSVG.svg"
                    x="0"
                    y="0"
                    width="2000"
                    height="857"
                    preserveAspectRatio="xMidYMid meet"
                    opacity="0.9"
                />

                {Object.values(locations).map((loc, i) => (
                    <g key={i}>
                        <circle cx={loc.x} cy={loc.y} r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth={1} className="drop-shadow" />
                        <text x={loc.x} y={loc.y + 16} textAnchor="middle" fill="#000000" fontSize="10" stroke="none" strokeWidth={0}>
                            {loc.label}
                        </text>
                    </g>
                ))}

                {tradeRoutes.map((route, i) => {
                    const start = locations.India;
                    const end = (locations as any)[route.to];
                    if (!end) return null;
                    const midX = (start.x + end.x) / 2;
                    const midY = (start.y + end.y) / 2 - (Math.abs(start.x - end.x) * 0.18);

                    return (
                        <path
                            key={i}
                            d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
                            fill="none"
                            stroke={route.color}
                            strokeWidth={route.value === "High" ? 3 : 2}
                            strokeLinecap="round"
                            strokeOpacity="0.85"
                            filter="url(#glow)"
                            className="animate-draw-line"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                values="0,1000;1000,0"
                                keyTimes="0;1"
                                dur="2.6s"
                                repeatCount="1"
                                begin="0s"
                            />
                        </path>
                    );
                })}
            </svg>
        </div>
    );
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-4 h-0.5" style={{ backgroundColor: color }} />
            <span>{label}</span>
        </div>
    );
}
