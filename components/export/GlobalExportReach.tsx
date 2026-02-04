"use client";

export function GlobalExportReach() {
    const locations = {
        India: { x: 1420, y: 360, label: "India" },
        USA: { x: 444, y: 247, label: "USA", export: "$76.1B" },
        UAE: { x: 1307, y: 309, label: "UAE", export: "$28.2B" },
        China: { x: 1600, y: 300, label: "China", export: "$21.3B" },
        EU: { x: 1022, y: 190, label: "Europe", export: "$59.4B" },
        UK: { x: 970, y: 186, label: "UK", export: "$11.2B" },
        Singapore: { x: 1577, y: 423, label: "Singapore", export: "$18.5B" },
        Bangladesh: { x: 1487, y: 336, label: "Bangladesh", export: "$10.9B" },
        SouthAfrica: { x: 1082, y: 636, label: "S. Africa", export: "$7.8B" },
        Japan: { x: 1780, y: 260, label: "Japan", export: "$6.4B" },
        Brazil: { x: 620, y: 576, label: "Brazil", export: "$5.2B" },
        Australia: { x: 1760, y: 700, label: "Australia", export: "$8.3B" }
    };

    const exportRoutes = [
        { to: "USA", volume: "Very High", color: "#8b5cf6", thickness: 4 }, // Violet - Highest export
        { to: "UAE", volume: "High", color: "#a78bfa", thickness: 3.5 },
        { to: "China", volume: "High", color: "#a78bfa", thickness: 3.5 },
        { to: "EU", volume: "Very High", color: "#8b5cf6", thickness: 4 },
        { to: "UK", volume: "Medium", color: "#c4b5fd", thickness: 2.5 },
        { to: "Singapore", volume: "High", color: "#a78bfa", thickness: 3 },
        { to: "Bangladesh", volume: "Medium", color: "#c4b5fd", thickness: 2.5 },
        { to: "SouthAfrica", volume: "Medium", color: "#c4b5fd", thickness: 2.5 },
        { to: "Japan", volume: "Medium", color: "#c4b5fd", thickness: 2.5 },
        { to: "Brazil", volume: "Low", color: "#ddd6fe", thickness: 2 },
        { to: "Australia", volume: "Medium", color: "#c4b5fd", thickness: 2.5 }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-xl font-black uppercase mb-1">Global Export Reach</h3>
                <p className="text-sm text-gray-600">Mapping India's export corridors and trade volume worldwide</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">$776B</div>
                    <div className="text-xs text-gray-500">Total Exports</div>
                    <div className="text-xs text-green-600 mt-1">+9.1% YoY</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">190+</div>
                    <div className="text-xs text-gray-500">Countries Reached</div>
                    <div className="text-xs text-gray-600 mt-1">Global presence</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">12.3%</div>
                    <div className="text-xs text-gray-500">Export Growth Rate</div>
                    <div className="text-xs text-gray-600 mt-1">Target: 10%</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">15.2%</div>
                    <div className="text-xs text-gray-500">of GDP</div>
                    <div className="text-xs text-gray-600 mt-1">Export contribution</div>
                </div>
            </div>

            {/* World Map Visual */}
            <div className="relative w-full h-[520px] bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-900 rounded-xl overflow-hidden shadow-xl border border-purple-800/30">
                {/* Legend Card */}
                <div className="absolute top-3 left-3 z-10 w-[240px] bg-purple-950/90 border border-purple-700/40 rounded-xl px-4 py-3 backdrop-blur-md shadow-lg">
                    <h3 className="text-lg font-bold text-white leading-tight">Export Volume Map</h3>
                    <p className="text-xs text-purple-200 mt-1">India's major export destinations</p>
                    <div className="flex flex-col gap-2 mt-3 text-xs text-purple-100">
                        <LegendDot color="#8b5cf6" label="Very High (&gt;$50B)" thickness={4} />
                        <LegendDot color="#a78bfa" label="High ($20B-$50B)" thickness={3} />
                        <LegendDot color="#c4b5fd" label="Medium ($5B-$20B)" thickness={2.5} />
                        <LegendDot color="#ddd6fe" label="Low (&lt;$5B)" thickness={2} />
                    </div>
                </div>

                {/* Top Exports Card */}
                <div className="absolute top-3 right-3 z-10 w-[220px] bg-purple-950/90 border border-purple-700/40 rounded-xl px-4 py-3 backdrop-blur-md shadow-lg">
                    <div className="text-sm font-bold text-white mb-2">Top Export Partners</div>
                    <div className="space-y-2 text-xs">
                        <ExportItem country="🇺🇸 USA" value="$76.1B" percent="9.8%" />
                        <ExportItem country="🇪🇺 Europe" value="$59.4B" percent="7.7%" />
                        <ExportItem country="🇦🇪 UAE" value="$28.2B" percent="3.6%" />
                        <ExportItem country="🇨🇳 China" value="$21.3B" percent="2.7%" />
                        <ExportItem country="🇸🇬 Singapore" value="$18.5B" percent="2.4%" />
                    </div>
                </div>

                <svg className="w-full h-full" viewBox="0 0 2000 857" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="glow-export">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <radialGradient id="pulse-gradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    <rect x="0" y="0" width="2000" height="857" fill="#1e1b4b" />
                    
                    {/* World Map SVG */}
                    <image
                        href="/WorlSVG.svg"
                        x="0"
                        y="0"
                        width="2000"
                        height="857"
                        preserveAspectRatio="xMidYMid meet"
                        opacity="0.85"
                        style={{ filter: 'grayscale(20%) brightness(0.7)' }}
                    />

                    {/* Export Routes (Trade Corridors) */}
                    {exportRoutes.map((route, i) => {
                        const start = locations.India;
                        const end = (locations as any)[route.to];
                        if (!end) return null;
                        
                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2 - (Math.abs(start.x - end.x) * 0.15);

                        return (
                            <g key={`route-${i}`}>
                                {/* Animated pulse effect along route */}
                                <path
                                    d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
                                    fill="none"
                                    stroke={route.color}
                                    strokeWidth={route.thickness}
                                    strokeLinecap="round"
                                    strokeOpacity="0.9"
                                    filter="url(#glow-export)"
                                >
                                    <animate
                                        attributeName="stroke-opacity"
                                        values="0.5;0.9;0.5"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        begin={`${i * 0.3}s`}
                                    />
                                </path>
                                
                                {/* Moving dot animation */}
                                <circle r="4" fill={route.color} opacity="0.9">
                                    <animateMotion
                                        dur="4s"
                                        repeatCount="indefinite"
                                        begin={`${i * 0.5}s`}
                                    >
                                        <mpath href={`#path-${i}`} />
                                    </animateMotion>
                                </circle>
                                <path
                                    id={`path-${i}`}
                                    d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
                                    fill="none"
                                    stroke="none"
                                />
                            </g>
                        );
                    })}

                    {/* Location Markers */}
                    {Object.entries(locations).map(([key, loc], i) => (
                        <g key={`marker-${i}`}>
                            {/* Pulsing circle for India */}
                            {key === "India" && (
                                <circle cx={loc.x} cy={loc.y} r="15" fill="url(#pulse-gradient)" opacity="0.6">
                                    <animate
                                        attributeName="r"
                                        values="15;25;15"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="0.6;0.2;0.6"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            )}
                            
                            {/* Main marker */}
                            <circle 
                                cx={loc.x} 
                                cy={loc.y} 
                                r={key === "India" ? 8 : 6} 
                                fill={key === "India" ? "#8b5cf6" : "#ddd6fe"} 
                                stroke={key === "India" ? "#ffffff" : "#7c3aed"} 
                                strokeWidth={key === "India" ? 2.5 : 1.5}
                                className="drop-shadow-lg"
                            />
                            
                            {/* Label with background */}
                            <text 
                                x={loc.x} 
                                y={loc.y + (key === "India" ? 20 : 18)} 
                                textAnchor="middle" 
                                fill="#ffffff" 
                                fontSize={key === "India" ? "12" : "10"}
                                fontWeight={key === "India" ? "bold" : "600"}
                                className="drop-shadow-lg"
                            >
                                {loc.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Data from 2023-24 • Source: Ministry of Commerce & Industry</span>
                <span className="text-purple-600 font-semibold">Updated: 2 hours ago</span>
            </div>
        </div>
    );
}

function LegendDot({ color, label, thickness }: { color: string; label: string; thickness: number }) {
    return (
        <div className="flex items-center gap-2">
            <span 
                className="w-6 rounded-full" 
                style={{ 
                    height: `${thickness}px`, 
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}`
                }} 
            />
            <span className="text-[11px]">{label}</span>
        </div>
    );
}

function ExportItem({ country, value, percent }: { country: string; value: string; percent: string }) {
    return (
        <div className="flex items-center justify-between text-purple-100 hover:text-white transition-colors">
            <span className="font-medium">{country}</span>
            <div className="flex items-center gap-2">
                <span className="font-bold">{value}</span>
                <span className="text-[10px] text-purple-300">({percent})</span>
            </div>
        </div>
    );
}
