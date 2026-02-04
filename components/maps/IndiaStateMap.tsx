"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import india from "@svg-maps/india";
import { stateBounds, stateCities } from "@/lib/data/indiaGeo";

type IndiaStateMapProps = {
  state: string;
};

const baseViewBox = (india as any).viewBox || "0 0 1000 1000";

function findState(stateName: string) {
  const locations = (india as any).locations || [];
  const target = locations.find(
    (loc: any) => typeof loc.name === "string" && loc.name.toLowerCase() === stateName.toLowerCase()
  );
  return target || null;
}

export function IndiaStateMap({ state }: IndiaStateMapProps) {
  const selected = useMemo(() => findState(state), [state]);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [bbox, setBbox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (pathRef.current) {
      const b = pathRef.current.getBBox();
      const pad = 10;
      setBbox({ x: b.x - pad, y: b.y - pad, width: b.width + pad * 2, height: b.height + pad * 2 });
    }
  }, [selected]);

  if (!selected) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-sm text-red-500 border border-red-200 rounded-lg">
        State outline not found: {state}
      </div>
    );
  }

  const gradId = `stateFill-${state.replace(/\s+/g, "-").toLowerCase()}`;

  const bounds = stateBounds[state] || null;
  const cities = stateCities[state] || [];

  const project = (lat: number, lon: number) => {
    if (!bbox || !bounds) return { x: bbox ? bbox.x + bbox.width / 2 : 0, y: bbox ? bbox.y + bbox.height / 2 : 0 };
    const nx = (lon - bounds.minLon) / (bounds.maxLon - bounds.minLon);
    const ny = (bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat);
    return { x: bbox.x + nx * bbox.width, y: bbox.y + ny * bbox.height };
  };

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const sizeScale = bbox ? Math.min(bbox.width, bbox.height) : 100;
  
  // Responsive sizing with breakpoints (like CSS media queries)
  const getResponsiveSize = (base: number, minSize: number, maxSize: number) => {
    return clamp(sizeScale * base, minSize, maxSize);
  };
  
  // Fluid typography - scales smoothly with state size
  const dotR = getResponsiveSize(0.018, 1.2, 6);
  const cityFont = getResponsiveSize(0.045, 4, 14);
  const stateFont = getResponsiveSize(0.065, 5, 18);
  const strokeW = getResponsiveSize(0.015, 0.8, 4);
  const labelStroke = getResponsiveSize(0.003, 0.3, 0.8);
  
  // Responsive spacing (like padding/margins in CSS)
  const spacing = {
    statePadding: getResponsiveSize(0.03, 2, 12),
    labelOffset: getResponsiveSize(0.05, 3, 10),
    staggerAmount: getResponsiveSize(0.025, 1.5, 6)
  };
  
  // Breakpoints for state sizes
  const isTiny = sizeScale <= 80;
  const isSmall = sizeScale <= 150;
  const isMedium = sizeScale <= 300;
  const showStateLabel = sizeScale > 60;

  return (
    <div className="w-full h-full">
      <svg
        viewBox={bbox ? `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}` : baseViewBox}
        role="img"
        aria-label={`${state} state map`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={selected.path}
          fill={`url(#${gradId})`}
          stroke="#0f172a"
          strokeWidth={strokeW}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {bbox && (
          <>
            {/* State label - responsive sizing */}
            {showStateLabel && (
              <text
              x={bbox.x + spacing.statePadding}
              y={bbox.y + stateFont + spacing.statePadding}
              fontSize={stateFont}
              fontWeight={isTiny ? 500 : isSmall ? 600 : 700}
              textAnchor="start"
              fill="#e5e7eb"
              stroke="#0f172a"
              strokeWidth={labelStroke}
              style={{ paintOrder: "stroke fill" }}
              lengthAdjust={sizeScale < 200 ? "spacingAndGlyphs" : undefined}
              textLength={sizeScale < 200 ? Math.min(bbox.width - spacing.statePadding * 2, stateFont * state.length * 0.55) : undefined}
              >
                {state}
              </text>
            )}

            {/* Cities - responsive layout */}
            {(cities.length ? cities : [{ name: "Capital", lat: 0, lon: 0 }]).map((c, i) => {
              const pos = c.lat && c.lon ? project(c.lat, c.lon) : { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
              const centerX = bbox.x + bbox.width / 2;
              const centerY = bbox.y + bbox.height / 2;
              const isLeft = pos.x < centerX;
              const isTop = pos.y < centerY;
              
              // Responsive label positioning - fluid offset
              const labelOffset = dotR + spacing.labelOffset;
              
              // Check if label would go out of bounds and adjust
              const estimatedTextWidth = cityFont * c.name.length * 0.5;
              const wouldExceedLeft = (pos.x - labelOffset - estimatedTextWidth) < bbox.x;
              const wouldExceedRight = (pos.x + labelOffset + estimatedTextWidth) > (bbox.x + bbox.width);
              
              // Force right placement if would exceed left, force left if would exceed right
              const finalIsLeft = wouldExceedLeft ? false : (wouldExceedRight ? true : isLeft);
              const labelX = finalIsLeft ? pos.x - labelOffset : pos.x + labelOffset;
              const labelAnchor: "start" | "end" = finalIsLeft ? "end" : "start";
              
              // Responsive vertical stagger to prevent overlaps
              const dy = ((i % 3) - 1) * spacing.staggerAmount;
              
              const fillColor = c.type === "capital" ? "#22c55e" : "#2563eb";
              const circleStroke = clamp(sizeScale * 0.008, 0.8, 2);
              
              // Adaptive text compression based on state size
              const shouldCompress = sizeScale < 250;
              const compressionRatio = isTiny ? 0.35 : isSmall ? 0.45 : isMedium ? 0.55 : 0.65;
              const availableWidth = finalIsLeft 
                ? (pos.x - labelOffset - bbox.x) 
                : (bbox.x + bbox.width - (pos.x + labelOffset));
              const maxTextLength = shouldCompress 
                ? Math.min(availableWidth * 0.9, bbox.width * compressionRatio, cityFont * c.name.length * 0.6)
                : undefined;
              
              return (
                <g key={`${c.name}-${i}`}>
                  <circle 
                    cx={pos.x} 
                    cy={pos.y + dy} 
                    r={dotR} 
                    fill={fillColor} 
                    stroke="#0f172a" 
                    strokeWidth={circleStroke} 
                  />
                  <text
                    x={labelX}
                    y={pos.y + dy + (cityFont * 0.35)}
                    fontSize={cityFont}
                    fontWeight={isTiny ? 500 : isSmall ? 600 : 700}
                    textAnchor={labelAnchor}
                    fill="#e5e7eb"
                    stroke="#0f172a"
                    strokeWidth={labelStroke}
                    style={{ paintOrder: "stroke fill" }}
                    lengthAdjust={shouldCompress ? "spacingAndGlyphs" : undefined}
                    textLength={maxTextLength}
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>
    </div>
  );
}

export default IndiaStateMap;
