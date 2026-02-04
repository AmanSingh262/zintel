"use client";

import { useEffect, useMemo, useState } from "react";
import { INDIA_STATES } from "@/lib/data/state-metadata";

interface SvgStatePath {
    svgId: string;
    name: string;
    d: string;
    metadataId?: string;
}

interface MigrationInfo {
    inflow: number; // thousands
    outflow: number; // thousands
}

interface Point {
    x: number;
    y: number;
}

const DEFAULT_VIEWBOX = "0 0 1000 1000";

// Simple migration mock data (net = inflow - outflow)
const MIGRATION_DATA: Record<string, MigrationInfo> = {
    MH: { inflow: 950, outflow: 420 },
    DL: { inflow: 620, outflow: 510 },
    KA: { inflow: 540, outflow: 380 },
    TN: { inflow: 460, outflow: 350 },
    GJ: { inflow: 430, outflow: 390 },
    RJ: { inflow: 220, outflow: 320 },
    UP: { inflow: 180, outflow: 780 },
    BR: { inflow: 140, outflow: 720 },
    WB: { inflow: 260, outflow: 410 },
    TG: { inflow: 350, outflow: 270 },
};

const STATE_POINTS: Record<string, Point> = {
    DL: { x: 490, y: 280 },
    UP: { x: 520, y: 420 },
    BR: { x: 600, y: 460 },
    RJ: { x: 330, y: 460 },
    MH: { x: 380, y: 640 },
    GJ: { x: 300, y: 610 },
    KA: { x: 430, y: 740 },
    TN: { x: 470, y: 860 },
    WB: { x: 710, y: 470 },
    TG: { x: 470, y: 700 },
};

const MIGRATION_FLOWS: Array<{ from: string; to: string; level: "high" | "medium" }> = [
    { from: "UP", to: "MH", level: "high" },
    { from: "BR", to: "DL", level: "high" },
    { from: "RJ", to: "GJ", level: "medium" },
    { from: "WB", to: "KA", level: "medium" },
    { from: "UP", to: "DL", level: "high" },
    { from: "BR", to: "MH", level: "medium" },
];

const FLOW_COLOR = "#4338ca";

export function MigrationMap() {
    const [paths, setPaths] = useState<SvgStatePath[]>([]);
    const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);
    const [hovered, setHovered] = useState<SvgStatePath | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const normalizedMetaNames = useMemo(() => {
        const map = new Map<string, string>();
        Object.values(INDIA_STATES).forEach((state) => {
            map.set(normalizeName(state.name), state.id);
        });
        return map;
    }, []);

    useEffect(() => {
        const loadSvg = async () => {
            try {
                const res = await fetch("/IndiaSVG.svg");
                const text = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "image/svg+xml");
                const box =
                    doc.documentElement.getAttribute("viewBox") ??
                    doc.documentElement.getAttribute("viewbox") ??
                    DEFAULT_VIEWBOX;

                const parsedPaths: SvgStatePath[] = Array.from(
                    doc.querySelectorAll("path[id][name]")
                ).map((el) => {
                    const svgId = el.getAttribute("id") ?? "";
                    const name = el.getAttribute("name") ?? svgId;
                    const d = el.getAttribute("d") ?? "";
                    return {
                        svgId,
                        name,
                        d,
                        metadataId: mapToMetadataId({ svgId, name, normalizedMetaNames }),
                    };
                });

                setViewBox(box);
                setPaths(parsedPaths);
            } catch (err) {
                console.error("Failed to load migration map SVG", err);
            }
        };

        loadSvg();
    }, [normalizedMetaNames]);

    const getNet = (stateId?: string) => {
        if (!stateId) return 0;
        const data = MIGRATION_DATA[stateId];
        if (!data) return 0;
        return data.inflow - data.outflow;
    };

    const colorForState = (stateId?: string) => {
        const net = getNet(stateId);
        const maxAbs = 600; // clamp for scale
        const ratio = Math.max(-1, Math.min(1, net / maxAbs));

        if (ratio >= 0) {
            // Green scale for net inflow
            const g = 140 + Math.round(80 * ratio);
            return `rgb(${80}, ${g}, ${110})`;
        }

        const r = 180 + Math.round(60 * Math.abs(ratio));
        return `rgb(${r}, 110, 110)`;
    };

    return (
        <div className="w-full h-[620px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 pt-4 pb-3 flex flex-col gap-2 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Migration Patterns</h3>
                    <span className="text-[11px] text-gray-500">(mock 2024)</span>
                </div>
                <p className="text-sm text-gray-600 leading-snug">Net inflow vs outflow by state with major flow arrows</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ background: "rgb(80,190,110)" }} />
                        <span>Net Inflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded" style={{ background: "rgb(210,110,110)" }} />
                        <span>Net Outflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-[2px] bg-indigo-500" />
                        <span>Inter-state flow</span>
                    </div>
                </div>
            </div>

            <div className="relative flex-1 min-h-0">
                <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="w-full h-full" aria-label="Migration map">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                            <polygon points="0 0, 10 5, 0 10" fill={FLOW_COLOR} />
                        </marker>
                    </defs>

                    {paths.map((state) => (
                        <path
                            key={state.svgId}
                            d={state.d}
                            fill={colorForState(state.metadataId)}
                            stroke="#ffffff"
                            strokeWidth={0.5}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) => {
                                setHovered(state);
                                setTooltipPos({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}

                    {MIGRATION_FLOWS.map((flow, idx) => renderFlow(flow, idx))}
                </svg>

                {hovered && (
                    <div
                        className="fixed bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50 text-sm pointer-events-none"
                        style={{
                            left: `${tooltipPos.x + 12}px`,
                            top: `${tooltipPos.y - 70}px`,
                            minWidth: "200px",
                        }}
                    >
                        {renderTooltip(hovered)}
                    </div>
                )}
            </div>
        </div>
    );
}

function renderTooltip(state: SvgStatePath) {
    const meta = state.metadataId ? INDIA_STATES[state.metadataId] : undefined;
    const id = state.metadataId ?? "";
    const migration = id ? MIGRATION_DATA[id] : undefined;
    const net = migration ? migration.inflow - migration.outflow : 0;

    return (
        <div className="space-y-1">
            <div className="font-semibold text-gray-900">
                {meta ? meta.name : state.name}
            </div>
            {migration ? (
                <>
                    <div className="text-xs text-gray-700">Inflow: {migration.inflow}k</div>
                    <div className="text-xs text-gray-700">Outflow: {migration.outflow}k</div>
                    <div className="text-xs font-semibold" style={{ color: net >= 0 ? "#15803d" : "#b91c1c" }}>
                        Net: {net >= 0 ? "+" : ""}{net}k
                    </div>
                </>
            ) : (
                <div className="text-xs text-gray-600">No migration data available</div>
            )}
            <div className="text-[11px] text-indigo-700 font-medium pt-1">Hover to compare inflow vs outflow</div>
        </div>
    );
}

function renderFlow(flow: { from: string; to: string; level: "high" | "medium" }, idx: number) {
    const from = STATE_POINTS[flow.from];
    const to = STATE_POINTS[flow.to];
    if (!from || !to) return null;

    const strokeWidth = flow.level === "high" ? 4 : 3;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    // Pull back start/end a bit so arrows sit on top of the state instead of its center
    const inset = 22;
    const start = { x: from.x + (dx / len) * inset, y: from.y + (dy / len) * inset };
    const end = { x: to.x - (dx / len) * inset, y: to.y - (dy / len) * inset };

    // Add a gentle curve perpendicular to the line for readability
    const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const norm = { x: -dy / len, y: dx / len };
    const curveOffset = flow.level === "high" ? 55 : 35;
    const control = { x: mid.x + norm.x * curveOffset, y: mid.y + norm.y * curveOffset };

    const pathD = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;

    // Position label near the control point for clarity
    const label = `${flow.from} → ${flow.to}`;
    return (
        <g key={`${flow.from}-${flow.to}-${idx}`} className="transition-opacity duration-200" style={{ pointerEvents: "none" }}>
            <path
                d={pathD}
                fill="none"
                stroke={FLOW_COLOR}
                strokeWidth={strokeWidth}
                strokeOpacity={0.82}
                markerEnd="url(#arrowhead)"
            />
            <text
                x={control.x}
                y={control.y - 6}
                textAnchor="middle"
                className="text-[11px] font-semibold"
                fill="#312e81"
                stroke="#ffffff"
                strokeWidth={0.9}
                paintOrder="stroke"
            >
                {label}
            </text>
        </g>
    );
}

function normalizeName(name: string) {
    return name.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}

function mapToMetadataId({
    svgId,
    name,
    normalizedMetaNames,
}: {
    svgId: string;
    name: string;
    normalizedMetaNames: Map<string, string>;
}) {
    const normalized = normalizeName(name);
    const byName = normalizedMetaNames.get(normalized);
    if (byName) return byName;

    const stripped = svgId.replace(/^IN/, "").toUpperCase();
    return INDIA_STATES[stripped] ? stripped : undefined;
}
