"use client";

import india from "@svg-maps/india";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StateSelectorProps = {
  value: string;
  onChange: (next: string) => void;
};

function getAllStateNames(): string[] {
  const locations = (india as any).locations || [];
  const names = locations
    .map((loc: any) => (typeof loc.name === "string" ? loc.name : null))
    .filter(Boolean) as string[];
  // De-duplicate and sort
  return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
}

export function StateSelector({ value, onChange }: StateSelectorProps) {
  const states = getAllStateNames();
  const idx = Math.max(0, states.findIndex((s) => s.toLowerCase() === value.toLowerCase()));

  const prev = () => {
    const nextIdx = (idx - 1 + states.length) % states.length;
    onChange(states[nextIdx]);
  };
  const next = () => {
    const nextIdx = (idx + 1) % states.length;
    onChange(states[nextIdx]);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 px-2 py-1"
        onClick={prev}
        aria-label="Previous state"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <select
        className="flex-1 rounded-md border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 px-2 py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select state"
      >
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 px-2 py-1"
        onClick={next}
        aria-label="Next state"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default StateSelector;
