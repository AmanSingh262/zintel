"use client";

import { useState, useEffect } from "react";
import { InteractiveIndiaMap } from "@/components/maps/InteractiveIndiaMap";

interface ClimateRiskData {
    state: string;
    riskScore: number;
    floodRisk: string;
    droughtRisk: string;
    cycloneRisk: string;
    heatwaveRisk: string;
}

const CLIMATE_RISK_DETAILS: Record<string, ClimateRiskData> = {
    "Odisha": { state: "Odisha", riskScore: 85, floodRisk: "Critical", droughtRisk: "High", cycloneRisk: "Critical", heatwaveRisk: "High" },
    "Assam": { state: "Assam", riskScore: 82, floodRisk: "Critical", droughtRisk: "Moderate", cycloneRisk: "Low", heatwaveRisk: "Moderate" },
    "Bihar": { state: "Bihar", riskScore: 80, floodRisk: "Critical", droughtRisk: "High", cycloneRisk: "Low", heatwaveRisk: "High" },
    "Andhra Pradesh": { state: "Andhra Pradesh", riskScore: 78, floodRisk: "High", droughtRisk: "High", cycloneRisk: "High", heatwaveRisk: "Critical" },
    "West Bengal": { state: "West Bengal", riskScore: 76, floodRisk: "Critical", droughtRisk: "Moderate", cycloneRisk: "High", heatwaveRisk: "Moderate" },
    "Maharashtra": { state: "Maharashtra", riskScore: 74, floodRisk: "High", droughtRisk: "Critical", cycloneRisk: "Moderate", heatwaveRisk: "High" },
    "Gujarat": { state: "Gujarat", riskScore: 72, floodRisk: "High", droughtRisk: "Critical", cycloneRisk: "High", heatwaveRisk: "Critical" },
    "Tamil Nadu": { state: "Tamil Nadu", riskScore: 70, floodRisk: "High", droughtRisk: "High", cycloneRisk: "High", heatwaveRisk: "Critical" },
    "Rajasthan": { state: "Rajasthan", riskScore: 68, floodRisk: "Low", droughtRisk: "Critical", cycloneRisk: "Low", heatwaveRisk: "Critical" },
    "Kerala": { state: "Kerala", riskScore: 67, floodRisk: "Critical", droughtRisk: "Moderate", cycloneRisk: "Moderate", heatwaveRisk: "Moderate" },
};

export function ClimateRiskMap() {
    const [liveUpdate, setLiveUpdate] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState<"overall" | "flood" | "drought" | "cyclone" | "heatwave">("overall");
    const [lastUpdate, setLastUpdate] = useState("");

    useEffect(() => {
        setLastUpdate(new Date().toLocaleString('en-IN', { 
            dateStyle: 'medium', 
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata' 
        }));
    }, []);

    const getTopRiskStates = () => {
        return Object.values(CLIMATE_RISK_DETAILS)
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5);
    };

    const getRiskStats = () => {
        const allStates = Object.values(CLIMATE_RISK_DETAILS);
        return {
            critical: allStates.filter(s => s.riskScore > 80).length,
            high: allStates.filter(s => s.riskScore > 60 && s.riskScore <= 80).length,
            moderate: allStates.filter(s => s.riskScore >= 40 && s.riskScore <= 60).length,
        };
    };

    const stats = getRiskStats();

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-red-500 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <div>
                    <h3 className="text-base sm:text-xl font-black uppercase">Climate Risk Index Map (India)</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Real-time climate vulnerability assessment</p>
                </div>
                <button
                    onClick={() => setLiveUpdate(!liveUpdate)}
                    className={`text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition w-fit ${liveUpdate
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {liveUpdate && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                        Live
                    </span>
                </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Deep analysis of vulnerable regions for floods, droughts, cyclones, and extreme weather events. Click states for detailed insights.
            </p>

            {/* Risk Type Filters */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <button
                    onClick={() => setSelectedMetric("overall")}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition ${
                        selectedMetric === "overall" 
                            ? "bg-red-500 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    🌍 Overall
                </button>
                <button
                    onClick={() => setSelectedMetric("flood")}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition ${
                        selectedMetric === "flood" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    🌊 Flood
                </button>
                <button
                    onClick={() => setSelectedMetric("drought")}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition ${
                        selectedMetric === "drought" 
                            ? "bg-orange-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    🏜️ Drought
                </button>
                <button
                    onClick={() => setSelectedMetric("cyclone")}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition ${
                        selectedMetric === "cyclone" 
                            ? "bg-purple-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    🌀 Cyclone
                </button>
                <button
                    onClick={() => setSelectedMetric("heatwave")}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition ${
                        selectedMetric === "heatwave" 
                            ? "bg-rose-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    🔥 Heatwave
                </button>
            </div>

            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 mb-3 sm:mb-4 h-[280px] sm:h-[420px]">
                <InteractiveIndiaMap layer="climate" />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: "#7f1d1d" }}></span>
                    <span className="text-gray-600">Critical (&gt;80)</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: "#dc2626" }}></span>
                    <span className="text-gray-600">High (60-80)</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: "#f97316" }}></span>
                    <span className="text-gray-600">Moderate (40-60)</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: "#16a34a" }}></span>
                    <span className="text-gray-600">Low (&lt;40)</span>
                </div>
            </div>

            {/* Top Risk States Analysis */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <span className="text-red-600">⚠️</span>
                    Top 5 High-Risk States
                </h4>
                <div className="space-y-1.5 sm:space-y-2">
                    {getTopRiskStates().map((state, index) => (
                        <div key={state.state} className="bg-white rounded-lg p-2 sm:p-3 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <span className="text-base sm:text-lg font-bold text-gray-400">#{index + 1}</span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{state.state}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                                        Flood: <span className={`font-semibold ${state.floodRisk === "Critical" ? "text-red-600" : state.floodRisk === "High" ? "text-orange-600" : "text-yellow-600"}`}>{state.floodRisk}</span>
                                        {" • "}
                                        Drought: <span className={`font-semibold ${state.droughtRisk === "Critical" ? "text-red-600" : state.droughtRisk === "High" ? "text-orange-600" : "text-yellow-600"}`}>{state.droughtRisk}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="text-lg sm:text-2xl font-bold text-red-600">{state.riskScore}</div>
                                <div className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">Risk Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.critical}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Critical Risk</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.high}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">High Risk</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">127</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Flood Districts</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">12</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Cyclone Zones</div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-[10px] sm:text-xs text-gray-500 pt-2 sm:pt-3 border-t border-gray-200">
                <span>Updated: {lastUpdate}</span>
                <span className="italic">IMD • NDMA</span>
            </div>
        </div>
    );
}
