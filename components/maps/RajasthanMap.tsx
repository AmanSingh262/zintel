"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import india from "@svg-maps/india";

const viewBox = (india as any).viewBox || "0 0 1000 1000";
const rajasthan = (india as any).locations?.find(
    (loc: any) => typeof loc.name === "string" && loc.name.toLowerCase() === "rajasthan"
);

export function RajasthanMap() {
    if (!rajasthan) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-sm text-red-500 border border-red-200 rounded-lg">
                Rajasthan outline not found in @svg-maps/india
            </div>
        );
    }

    const pathRef = useRef<SVGPathElement | null>(null);
    const [bbox, setBbox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    useEffect(() => {
        if (pathRef.current) {
            const b = pathRef.current.getBBox();
            const pad = 8;
            setBbox({ x: b.x - pad, y: b.y - pad, width: b.width + pad * 2, height: b.height + pad * 2 });
        }
    }, []);

    // Rajasthan lat/lon bounds (approx)
    const bounds = { minLat: 23.3, maxLat: 29.9, minLon: 69.3, maxLon: 78.17 };

    const cities = useMemo(
        () => [
            { name: "Jaipur", lat: 26.9124, lon: 75.7873, color: "#2563eb" },
            { name: "Jodhpur", lat: 26.2389, lon: 73.0243, color: "#f59e0b" },
            { name: "Udaipur", lat: 24.5854, lon: 73.7125, color: "#22c55e" },
            { name: "Bikaner", lat: 28.0229, lon: 73.3119, color: "#f59e0b" },
            { name: "Barmer", lat: 25.7500, lon: 71.3800, color: "#f59e0b" },
            { name: "Ajmer", lat: 26.4499, lon: 74.6399, color: "#2563eb" },
            { name: "Kota", lat: 25.2138, lon: 75.8648, color: "#22c55e" },
            { name: "Jaisalmer", lat: 26.9100, lon: 70.9200, color: "#f59e0b" }
        ],
        []
    );

    const project = (lat: number, lon: number) => {
        if (!bbox) return { x: 0, y: 0 };
        const nx = (lon - bounds.minLon) / (bounds.maxLon - bounds.minLon);
        const ny = (bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat);
        return { x: bbox.x + nx * bbox.width, y: bbox.y + ny * bbox.height };
    };

    return (
        <div className="w-full h-full">
            <svg
                viewBox={bbox ? `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}` : viewBox}
                role="img"
                aria-label="Rajasthan state map"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="rajFill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                </defs>
                <path
                    ref={pathRef}
                    d={rajasthan.path}
                    fill="url(#rajFill)"
                    stroke="#0f172a"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {bbox &&
                    cities.map((c, i) => {
                        const { x, y } = project(c.lat, c.lon);
                        const centerX = bbox.x + bbox.width / 2;
                        const isLeft = x < centerX;
                        const labelX = isLeft ? x - 10 : x + 10;
                        const labelAnchor = isLeft ? "end" : "start";
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r={6} fill={c.color} stroke="#0f172a" strokeWidth={1.5} />
                                <text
                                    x={labelX}
                                    y={y - 1}
                                    fontSize={11}
                                    fontWeight={600}
                                    textAnchor={labelAnchor}
                                    fill="#e5e7eb"
                                    stroke="#0f172a"
                                    strokeWidth={0.6}
                                    style={{ paintOrder: "stroke fill" }}
                                >
                                    {c.name}
                                </text>
                            </g>
                        );
                    })}
            </svg>
        </div>
    );
}
