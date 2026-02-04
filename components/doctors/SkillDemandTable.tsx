"use client";

import { useEffect, useState } from "react";
import budgetApi from "@/lib/budget-api";

interface SkillData {
    sector: string;
    skill: string;
    demand: string;
    salary_min: number;
    salary_max: number;
    demand_score: number;
    color: string;
}

interface DemandLevels {
    [key: string]: {
        score_range: string;
        color: string;
    };
}

export function SkillDemandTable() {
    const [data, setData] = useState<SkillData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSector, setSelectedSector] = useState<string>("All");
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [demandLevels, setDemandLevels] = useState<DemandLevels>({});
    const [sectors, setSectors] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 20 minutes
        const interval = setInterval(fetchData, 1200000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(budgetApi.salarySkillDemandHeatmap());
            if (!response.ok) throw new Error("Failed to fetch data");
            const result = await response.json();
            setData(result.data);
            setSectors(result.sectors);
            setDemandLevels(result.demand_levels);
            setLastUpdated(result.updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredData = () => {
        if (selectedSector === "All") return data;
        return data.filter((item) => item.sector === selectedSector);
    };

    const getDemandBadgeClass = (color: string) => {
        const baseClasses = "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold";
        return `${baseClasses} text-white`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black uppercase mb-6">Skill Demand vs. Salary Heatmap</h3>
                <div className="h-[300px] md:h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">Loading skill data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black uppercase mb-6">Skill Demand vs. Salary Heatmap</h3>
                <div className="h-[300px] md:h-[400px] flex items-center justify-center text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }

    const filteredData = getFilteredData();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg md:text-xl font-black uppercase mb-1">
                    Skill Demand vs. Salary Heatmap
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                    In-demand skills with salary ranges across sectors
                </p>
            </div>

            {/* Sector Filter */}
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedSector("All")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedSector === "All"
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    All Sectors
                </button>
                {sectors.map((sector) => (
                    <button
                        key={sector}
                        onClick={() => setSelectedSector(sector)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selectedSector === sector
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {sector}
                    </button>
                ))}
            </div>

            {/* Legend */}
            <div className="mb-3 flex flex-wrap gap-2 items-center text-xs">
                <span className="font-semibold text-gray-600">Demand Level:</span>
                {Object.entries(demandLevels).map(([level, info]) => (
                    <div key={level} className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: info.color }}
                        />
                        <span className="text-[10px] text-gray-600">{level}</span>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto" style={{ maxHeight: "400px" }}>
                <table className="w-full text-xs md:text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-2 px-2 md:px-3 font-bold text-gray-700">Skill</th>
                            {selectedSector === "All" && (
                                <th className="text-left py-2 px-2 md:px-3 font-bold text-gray-700">Sector</th>
                            )}
                            <th className="text-center py-2 px-2 md:px-3 font-bold text-gray-700">Demand</th>
                            <th className="text-center py-2 px-2 md:px-3 font-bold text-gray-700">Score</th>
                            <th className="text-right py-2 px-2 md:px-3 font-bold text-gray-700">Salary Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-2.5 px-2 md:px-3 font-semibold text-gray-900">
                                    {item.skill}
                                </td>
                                {selectedSector === "All" && (
                                    <td className="py-2.5 px-2 md:px-3 text-gray-600 text-[10px] md:text-xs">
                                        {item.sector}
                                    </td>
                                )}
                                <td className="py-2.5 px-2 md:px-3 text-center">
                                    <span
                                        className={getDemandBadgeClass(item.color)}
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.demand}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2 md:px-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="w-full max-w-[60px] h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${item.demand_score}%`,
                                                    backgroundColor: item.color
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 min-w-[24px]">
                                            {item.demand_score}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-2.5 px-2 md:px-3 text-right font-bold text-gray-900">
                                    <span className="text-[10px] md:text-xs">₹{item.salary_min}-{item.salary_max}L</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-gray-500">
                <span className="text-[10px] md:text-xs">Source: NASSCOM, Ministry of Labour 2024-25</span>
                {lastUpdated && (
                    <span className="text-[10px] md:text-xs text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}
