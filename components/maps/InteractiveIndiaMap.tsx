"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INDIA_STATES } from "@/lib/data/state-metadata";

interface InteractiveIndiaMapProps {
    layer?: "default" | "poverty" | "climate";
}

interface SvgStatePath {
    svgId: string;
    name: string;
    d: string;
    metadataId?: string;
}

const NAME_OVERRIDES: Record<string, string> = {
    "andaman and nicobar": "AN",
    "andaman and nicobar islands": "AN",
    "dadra and nagar haveli": "DN",
    "daman and diu": "DN",
    "dadra and nagar haveli and daman and diu": "DN",
    "delhi": "DL",
    "jammu and kashmir": "JK",
    "uttarakhand": "UT",
    "uttaranchal": "UT",
    "orissa": "OR",
    "odisha": "OR",
    "pondicherry": "PY",
    "puducherry": "PY",
    "telangana": "TG",
    "ladakh": "LA",
};

// Mock Data for Heat Maps
const POVERTY_DATA: Record<string, number> = {
    "BR": 33.76, "JH": 28.81, "UP": 22.93, "MP": 20.63, "ML": 25.46,
    "AS": 19.35, "CG": 16.37, "RJ": 15.31, "OD": 15.68, "NL": 15.43,
    "TR": 11.57, "WB": 11.89, "AR": 13.18, "KA": 7.58, "AP": 6.06,
    "GJ": 11.66, "MH": 7.74, "HP": 4.93, "TN": 2.20, "KL": 0.55,
    "GA": 0.80, "SK": 2.60, "PB": 4.75, "HR": 7.07, "MZ": 5.30,
    "MN": 16.96, "DL": 3.43, "CH": 2.62, "PY": 0.85, "AN": 2.30,
    "JK": 3.56, "LA": 3.56, "UT": 9.67, "TG": 5.88,
    // Default fallback
    "DEFAULT": 10.0
};

const CLIMATE_RISK_DATA: Record<string, number> = {
    "OD": 85, "AS": 82, "BR": 80, "AP": 78, "WB": 76,
    "MH": 74, "GJ": 72, "TN": 70, "RJ": 68, "KL": 67,
    "KA": 65, "UP": 62, "MP": 60, "JH": 58, "CG": 55,
    "DL": 52, "HR": 50, "PB": 48, "UT": 65, "HP": 62,
    "JK": 55, "LA": 50, "SK": 45, "AR": 42, "NL": 40,
    "MN": 45, "MZ": 42, "TR": 48, "ML": 45, "GA": 35,
    // Default fallback
    "DEFAULT": 50
};

const DEFAULT_VIEWBOX = "0 0 1000 1000";

export function InteractiveIndiaMap({ layer = "default" }: InteractiveIndiaMapProps) {
    const router = useRouter();
    const [paths, setPaths] = useState<SvgStatePath[]>([]);
    const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);
    const [hovered, setHovered] = useState<SvgStatePath | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const normalizedMetaNames = useMemo(() => {
        const map = new Map<string, string>();
        Object.values(INDIA_STATES).forEach((state) => {
            const key = normalizeName(state.name);
            map.set(key, state.id);
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
                console.error("Failed to load IndiaSVG.svg", err);
            }
        };

        loadSvg();
    }, [normalizedMetaNames]);

    const getFill = (state: SvgStatePath) => {
        if (hovered?.svgId === state.svgId) {
            return "#2563eb"; // Blue highlight on hover
        }

        const stateId = state.metadataId || "DEFAULT";

        if (layer === "poverty") {
            const val = POVERTY_DATA[stateId] ?? 10;
            if (val > 25) return "#b91c1c"; // High Poverty - Red
            if (val > 15) return "#f97316"; // Med-High - Orange
            if (val > 5) return "#facc15";  // Moderate - Yellow
            return "#16a34a";               // Low - Green
        }

        if (layer === "climate") {
            const val = CLIMATE_RISK_DATA[stateId] ?? 40;
            if (val > 80) return "#7f1d1d"; // Critical - Dark Red
            if (val > 60) return "#dc2626"; // High - Red
            if (val > 40) return "#f97316"; // Moderate - Orange
            return "#16a34a";               // Low - Green
        }

        return "#d8b4fe"; // Standard View - Light Zintel Purple (Brand Lite)
    };

    const handleClick = (state: SvgStatePath) => {
        const targetId = state.metadataId ?? deriveIdFallback(state.svgId);
        if (targetId) {
            router.push(`/state/${targetId.toLowerCase()}`);
        }
    };

    return (
        <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    viewBox={viewBox}
                    className="w-full h-full"
                    aria-label="Interactive map of India"
                >
                    {paths.map((state) => (
                        <path
                            key={state.svgId}
                            d={state.d}
                            fill={getFill(state)}
                            stroke="#ffffff"
                            strokeWidth={0.5}
                            className="transition duration-150 ease-in-out"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) => {
                                setHovered(state);
                                setTooltipPos({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => handleClick(state)}
                        />
                    ))}
                </svg>
            </div>

            {hovered && (
                <div
                    className="fixed bg-white rounded-lg shadow-2xl p-3 border border-indigo-200 z-50 pointer-events-none"
                    style={{
                        left: `${tooltipPos.x + 14}px`,
                        top: `${tooltipPos.y - 70}px`,
                        minWidth: "200px",
                    }}
                >
                    {renderTooltipContent(hovered, layer)}
                </div>
            )}

            {layer === "default" && (
                <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow-md p-3 text-sm text-gray-700 backdrop-blur">
                    <div className="font-semibold">🗺️ Interactive India Map</div>
                    <div className="text-xs text-gray-500">Hover to preview • Click to dive deeper</div>
                </div>
            )}

            {layer !== "default" && (
                <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg shadow-md p-2 text-[9px] sm:text-xs backdrop-blur max-w-[135px] sm:max-w-none">
                    <div className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-[10px] sm:text-sm">
                        {layer === "poverty" ? "📊 Poverty" : "🌡️ Risk"}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 text-gray-700">
                        {layer === "poverty" ? (
                            <>
                                <LegendSwatch color="#b91c1c" label="> 25% (High)" />
                                <LegendSwatch color="#f97316" label="15-25%" />
                                <LegendSwatch color="#facc15" label="5-15%" />
                                <LegendSwatch color="#16a34a" label="< 5% (Low)" />
                            </>
                        ) : (
                            <>
                                <LegendSwatch color="#7f1d1d" label="> 80 (Crit)" />
                                <LegendSwatch color="#dc2626" label="60-80 (High)" />
                                <LegendSwatch color="#f97316" label="40-60 (Mod)" />
                                <LegendSwatch color="#16a34a" label="< 40 (Low)" />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function normalizeName(name: string) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^a-z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
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
    if (NAME_OVERRIDES[normalized]) {
        return NAME_OVERRIDES[normalized];
    }

    const fallbackByName = normalizedMetaNames.get(normalized);
    if (fallbackByName) {
        return fallbackByName;
    }

    const stripped = svgId.replace(/^IN/, "").toUpperCase();
    if (INDIA_STATES[stripped]) {
        return stripped;
    }

    return undefined;
}

function deriveIdFallback(svgId: string) {
    const stripped = svgId.replace(/^IN/, "").toUpperCase();
    return INDIA_STATES[stripped] ? stripped : undefined;
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1 sm:gap-2">
            <span className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="leading-tight">{label}</span>
        </div>
    );
}

function renderTooltipContent(state: SvgStatePath, layer: string) {
    const meta = state.metadataId ? INDIA_STATES[state.metadataId] : undefined;
    const stateId = state.metadataId || "DEFAULT";

    return (
        <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">
                {meta ? meta.name : state.name}
            </div>
            
            {layer === "poverty" && (
                <div className="py-1 border-b border-gray-100 mb-1">
                    <div className="text-xs text-gray-500">Multidimensional Poverty</div>
                    <div className={`text-sm font-bold ${
                        (POVERTY_DATA[stateId] || 0) > 20 ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                        {POVERTY_DATA[stateId] ? `${POVERTY_DATA[stateId]}%` : 'N/A'}
                    </div>
                </div>
            )}

            {layer === "climate" && (
                <div className="py-1 border-b border-gray-100 mb-1">
                    <div className="text-xs text-gray-500">Climate Risk Index</div>
                    <div className={`text-sm font-bold ${
                        (CLIMATE_RISK_DATA[stateId] || 0) > 60 ? 'text-red-600' : 'text-orange-500'
                    }`}>
                        {CLIMATE_RISK_DATA[stateId] ? `${CLIMATE_RISK_DATA[stateId]}/100` : 'N/A'}
                    </div>
                </div>
            )}

            {meta && layer === "default" && (
                <>
                    <div className="text-xs text-gray-700">Capital: {meta.capital}</div>
                    <div className="text-xs text-gray-700">
                        Population: {formatCrores(meta.population)} Cr
                    </div>
                    <div className="text-xs text-gray-700">
                        Literacy: {meta.literacy.toFixed(1)}%
                    </div>
                </>
            )}
            <div className="text-[11px] text-indigo-700 font-medium pt-1">
                Click to open state dashboard
            </div>
        </div>
    );
}

function formatCrores(value: number) {
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
