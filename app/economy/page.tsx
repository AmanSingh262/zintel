"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CentralStateToggle } from "@/components/ui/CentralStateToggle";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import charts with SSR disabled to prevent hydration errors
const IncomeBarChart = dynamic(
    () => import("@/components/charts/IncomeBarChart"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
    }
);

const ExportImportChart = dynamic(
    () => import("@/components/charts/ExportImportChart"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
    }
);

const HouseholdIncomeChart = dynamic(
    () => import("@/components/charts/HouseholdIncomeChart"),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
    }
);

const StartupDistributionChart = dynamic(
    () => import("@/components/charts/StartupDistributionChart").then(mod => mod.StartupDistributionChart),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg"></div>
    }
);

const WorldTradeMap = dynamic(
    () => import("@/components/maps/WorldTradeMap").then(mod => mod.WorldTradeMap),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-900 animate-pulse rounded-lg"></div>
    }
);

export default function CitizenEconomyDashboard() {
    const [viewMode, setViewMode] = useState<"central" | "state">("central");
    const [loading, setLoading] = useState(true);
    
    const [stats, setStats] = useState<any[]>([]);
    const [incomeTrend, setIncomeTrend] = useState<any[]>([]); // Central
    const [stateIncome, setStateIncome] = useState<any[]>([]); // State
    const [householdData, setHouseholdData] = useState<any[]>([]);
    const [tradeData, setTradeData] = useState<any[]>([]);
    const [startupData, setStartupData] = useState<any[]>([]);
    const [povertyData, setPovertyData] = useState<any[]>([]);

    useEffect(() => {
        const fetchEconomyData = async () => {
            try {
                const [
                    statsRes, 
                    trendRes, 
                    stateRes, 
                    distRes, 
                    tradeRes, 
                    startupRes, 
                    povertyRes
                ] = await Promise.all([
                    fetch("http://localhost:8002/economy/stats").then(r => r.json()),
                    fetch("http://localhost:8002/economy/income/trend").then(r => r.json()),
                    fetch("http://localhost:8002/economy/income/states").then(r => r.json()),
                    fetch("http://localhost:8002/economy/income/distribution").then(r => r.json()),
                    fetch("http://localhost:8002/economy/trade/balance").then(r => r.json()),
                    fetch("http://localhost:8002/economy/startups").then(r => r.json()),
                    fetch("http://localhost:8002/economy/poverty").then(r => r.json()),
                ]);

                if (statsRes.stats) setStats(statsRes.stats);
                if (trendRes.data) setIncomeTrend(trendRes.data);
                if (stateRes.data) setStateIncome(stateRes.data);
                
                if (distRes.brackets) {
                    // Transform for chart
                    const transformed = distRes.brackets.map((b: any, i: number) => ({
                        bracket: b.range,
                        percentage: b.percentage,
                        count: `${Math.round(b.percentage * 3)}M`, // Mock count logic
                        color: ["#ef4444", "#f97316", "#eab308", "#10b981", "#2e008b"][i]
                    }));
                    setHouseholdData(transformed);
                }

                if (tradeRes.data) setTradeData(tradeRes.data);
                
                if (startupRes.distribution) {
                    const transformedStartup = startupRes.distribution.map((s: any, i: number) => ({
                        name: s.state,
                        value: s.share,
                        color: ["#2e008b", "#10b981", "#f97316", "#ef4444", "#eab308", "#9ca3af"][i % 6]
                    }));
                    setStartupData(transformedStartup);
                }

                if (povertyRes.regions) setPovertyData(povertyRes.regions);

            } catch (err) {
                console.error("Failed to fetch economy data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEconomyData();
    }, []);

    // Select data based on mode
    const chartData = viewMode === "central" ? (incomeTrend.length ? incomeTrend : []) : (stateIncome.length ? stateIncome : []);
    const xAxisKey = viewMode === "central" ? "year" : "state";
    const chartColor = viewMode === "central" ? "#2e008b" : "#10b981"; // Purple vs Green

    const displayStats = stats.length > 0 ? stats : [
        {
            title: "Live Employment Creation",
            value: "Loading...",
            subtitle: "Jobs Created This Year",
            updated: "Updating...",
            valueColor: "text-gray-400", 
        }
    ];

    const getLevelBadge = (level: string) => {
        switch (level) {
            case "High":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        High
                    </span>
                );
            case "Medium":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Medium
                    </span>
                );
            case "Low":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600">
                        Low
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Citizen Economy
                    </h1>
                    <p className="text-gray-600">
                        {viewMode === 'central'
                            ? "Overview of National Economic Indicators & Growth Trends"
                            : "Comparative Analysis of State-wise Economic Performance"}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <CentralStateToggle
                        viewMode={viewMode}
                        onToggle={setViewMode}
                    />
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* 4 STATS CARDS - Exact screenshot layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {displayStats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all"
                    >
                        <p className="text-sm font-medium text-gray-600 mb-3">
                            {stat.title}
                        </p>
                        <p className={`text-3xl font-bold ${stat.valueColor} mb-2`}>
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">{stat.subtitle}</p>
                        <p className="text-xs text-gray-400">{stat.updated}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* CHART 1: Dynamic Income Chart */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                {viewMode === 'central' ? "National Per Capita Growth" : "State-wise Income Comparison"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {viewMode === 'central'
                                    ? "Annual growth trend of average Indian income (2019-2024)"
                                    : "Top performing states by per capita income (2023)"}
                            </p>
                        </div>
                        {/* Mini indicator */}
                        <span className={`px-2 py-1 text-xs font-bold rounded ${viewMode === 'central' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                            {viewMode === 'central' ? "NATIONAL" : "STATE-WISE"}
                        </span>
                    </div>

                    <div className="h-[320px]">
                        <IncomeBarChart
                            key={viewMode} // Forces re-animation on toggle
                            data={chartData}
                            xAxisKey={xAxisKey}
                            barKey="income"
                            fillColor={chartColor}
                        />
                    </div>
                </div>

                {/* CHART 2: Household Income Distribution */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        Household Income Distribution
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Annual income brackets of Indian households (2023 Survey)
                    </p>
                    <div className="h-[320px]">
                        <HouseholdIncomeChart data={householdData} />
                    </div>
                </div>
            </div>

            {/* CHART 3: Trade & Innovation Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        India's Trade Balance
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Trend analysis of merchandise trade (Billion USD)
                    </p>
                    <div className="h-[350px]">
                        <ExportImportChart data={tradeData} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        Innovation & Startups
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Leading states by recognized startup density
                    </p>
                    <div className="h-[350px]">
                        <StartupDistributionChart data={startupData} />
                    </div>
                </div>
            </div>

            {/* GLOBAL TRADE MAP (Phase 5 Addition) */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Global Trade Intelligence</h2>
                <p className="text-gray-600 mb-6">Real-time tracking of India's major export-import corridors and trade volume.</p>
                <div className="h-[350px] md:h-[500px] w-full">
                    <WorldTradeMap />
                </div>
            </div>

            {/* CHART 3: Poverty & Vulnerability Index Table */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Poverty & Vulnerability Index
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Multi-dimensional index across various regions of India.
                </p>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Region
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Index Score
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Vulnerability Level
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(povertyData.length > 0 ? povertyData : []).map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="py-4 px-4 text-sm text-gray-900">
                                        {row.region}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {row.score.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4">{getLevelBadge(row.level)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>© 2025 Zintel. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Contact Us
                        </a>
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Accessibility
                        </a>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
