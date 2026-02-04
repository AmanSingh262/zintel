"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CentralStateToggle } from "@/components/ui/CentralStateToggle";
import { StatCard } from "@/components/ui/StatCard";
import { Users, TrendingDown, TrendingUp, Smartphone, Laptop } from "lucide-react";
import { MigrationMap } from "@/components/maps/MigrationMap";
import dynamic from "next/dynamic";

// Reuse the generic bar chart 
const SectorBarChart = dynamic(
    () => import("@/components/charts/IncomeBarChart"),
    { ssr: false, loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
);

// Helper function to parse population strings like "1.42B" to numbers
function parsePopulationString(popStr: string): number {
    const multipliers: Record<string, number> = {
        'B': 1000000000,
        'M': 1000000,
        'K': 1000
    };

    const match = popStr.match(/^([\d.]+)([BMK]?)$/i);
    if (!match) return 1420000000; // fallback

    const value = parseFloat(match[1]);
    const suffix = match[2].toUpperCase();
    return value * (multipliers[suffix] || 1);
}

// Helper function to format population number to display string with comma separators
function formatPopulation(num: number): string {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export default function PopulationPage() {
    const [viewMode, setViewMode] = useState<"central" | "state">("central");
    const [livePopulation, setLivePopulation] = useState<number>(1430000000); // 1.43 billion initial
    const [startOfYearPop, setStartOfYearPop] = useState<number>(1420000000); // Fallback Jan 1st
    const [showTotalPopulation, setShowTotalPopulation] = useState<boolean>(true);
    const [statePopulationData, setStatePopulationData] = useState<any[]>([
        { state: "Uttar Pradesh", population: "24.1 Cr", unemployment: "17.5%", trend: "up" as const },
        { state: "Maharashtra", population: "12.6 Cr", unemployment: "9.8%", trend: "down" as const },
        { state: "Bihar", population: "12.8 Cr", unemployment: "21.2%", trend: "up" as const },
        { state: "West Bengal", population: "10.2 Cr", unemployment: "12.3%", trend: "neutral" as const },
        { state: "Madhya Pradesh", population: "8.9 Cr", unemployment: "10.5%", trend: "down" as const },
        { state: "Tamil Nadu", population: "8.2 Cr", unemployment: "6.8%", trend: "down" as const },
    ]);
    const [migrationData, setMigrationData] = useState<any>(null);

    // Central Data: National Population Growth Trend (in Crores)
    const centralPopData = [
        { year: "2019", value: 13660 },
        { year: "2020", value: 13800 },
        { year: "2021", value: 13930 },
        { year: "2022", value: 14070 },
        { year: "2023", value: 14280 },
        { year: "2024", value: 14400 },
    ];

    // State Data: Top States Population (in Crores)
    const statePopData = [
        { state: "UP", value: 24.1 },
        { state: "Maharashtra", value: 12.6 },
        { state: "Bihar", value: 12.8 },
        { state: "West Bengal", value: 10.2 },
        { state: "MP", value: 8.9 },
        { state: "Tamil Nadu", value: 8.2 },
    ];

    // Chart logic
    const chartData = viewMode === "central" ? centralPopData : statePopData;
    const xAxisKey = viewMode === "central" ? "year" : "state";
    const barKey = "value";
    const chartColor = viewMode === "central" ? "#2e008b" : "#10b981";

    // Fetch state population data from API
    useEffect(() => {
        const fetchStateData = async () => {
            try {
                const res = await fetch("/api/population/states");
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data)) {
                        setStatePopulationData(data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch state population data:", err);
            }
        };

        fetchStateData();

        // Auto-refresh every 10 minutes
        const interval = setInterval(fetchStateData, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch migration data from API
    useEffect(() => {
        const fetchMigration = async () => {
            try {
                const res = await fetch("/api/population/migration");
                if (res.ok) {
                    const data = await res.json();
                    setMigrationData(data);
                }
            } catch (err) {
                console.error("Failed to fetch migration data:", err);
            }
        };

        fetchMigration();

        // Auto-refresh every 10 minutes
        const interval = setInterval(fetchMigration, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);


    // Population Clock - Real-time ticking counter
    useEffect(() => {
        const initPopulationClock = async () => {
            try {
                // Use fixed baseline for accurate calculation
                const jan1Population = 1428900000; // 1.4289B on Jan 1, 2026
                const growthRate = 0.008; // 0.8%
                const annualIncrease = jan1Population * growthRate; // ~11,431,200 per year
                const increasePerMs = annualIncrease / (365.25 * 24 * 60 * 60 * 1000);

                const now = new Date();
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const msElapsed = now.getTime() - startOfYear.getTime();

                // Calculate current population from Jan 1 baseline
                const currentPopulation = jan1Population + (increasePerMs * msElapsed);

                console.log('Population Debug:', {
                    jan1Population,
                    msElapsed,
                    daysElapsed: msElapsed / (1000 * 60 * 60 * 24),
                    growthSoFar: increasePerMs * msElapsed,
                    currentPopulation
                });

                setLivePopulation(currentPopulation);
                setStartOfYearPop(jan1Population);

                // Update counter every 100ms
                const clockInterval = setInterval(() => {
                    setLivePopulation(prev => prev + (increasePerMs * 100));
                }, 100);

                return () => clearInterval(clockInterval);
            } catch (err) {
                console.error("Population clock error:", err);
            }
        };

        const cleanup = initPopulationClock();
        return () => {
            cleanup.then(fn => fn && fn());
        };
    }, []);


    // Toggle between Population and Growth Rate every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setShowTotalPopulation(prev => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Population & Migration</h1>
                    <p className="text-gray-600">
                        {viewMode === 'central'
                            ? "National Demographic Trends & Statistics"
                            : "State-wise Population & Migration Analysis"}
                    </p>
                </div>
                <CentralStateToggle
                    viewMode={viewMode}
                    onToggle={setViewMode}
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Live Population Clock Card */}
                <div className="card bg-gradient-to-br from-purple-50 to-white border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-600">
                                {showTotalPopulation ? "Total Population" : "Net Growth (2026)"}
                            </span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                            LIVE
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2 font-mono transition-opacity duration-500">
                        {showTotalPopulation
                            ? formatPopulation(livePopulation)
                            : `~${formatPopulation(Math.floor(livePopulation - startOfYearPop))}`
                        }
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                        {showTotalPopulation ? "Real-time India Population Clock" : "Population Added This Year (Live)"}
                    </p>
                    <div className="space-y-2 pt-3 border-t border-purple-100">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Annual Growth Rate</span>
                            <span className="text-green-600 font-bold">+0.8%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Births per day</span>
                            <span className="text-blue-600 font-bold">~67,385</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Deaths per day</span>
                            <span className="text-red-600 font-bold">~27,397</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-100">
                            <span className="text-gray-600 font-semibold">Net increase per day</span>
                            <span className="text-purple-600 font-bold">~39,988</span>
                        </div>
                    </div>
                </div>

                {/* Youth Unemployment Card */}
                <div className="card bg-gradient-to-br from-blue-50 to-white border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Avg Youth Unemployment</span>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            HIGH
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        23.2%
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Ages 15-24 (National Average)</p>
                    <div className="space-y-2 pt-3 border-t border-blue-100">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Age 15-19</span>
                            <span className="text-orange-600 font-bold">26.8%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Age 20-24</span>
                            <span className="text-red-600 font-bold">28.5%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Male Youth</span>
                            <span className="text-red-600 font-bold">22.4%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-100">
                            <span className="text-gray-600 font-semibold">Female Youth</span>
                            <span className="text-red-700 font-bold">30.2%</span>
                        </div>
                    </div>
                </div>

                {/* Rural to Urban Migration Card */}
                <div className="card bg-gradient-to-br from-green-50 to-white border-green-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Rural to Urban Migration</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            RISING
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        +12%
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Annual Migration Rate (2024)</p>
                    <div className="space-y-2 pt-3 border-t border-green-100">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Total Migrants</span>
                            <span className="text-blue-600 font-bold">~92 Lakh</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Top Destination</span>
                            <span className="text-purple-600 font-bold">Mumbai</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">Main Reason</span>
                            <span className="text-indigo-600 font-bold">Employment</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-green-100">
                            <span className="text-gray-600 font-semibold">Urban Population %</span>
                            <span className="text-green-600 font-bold">35.4%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="card mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {viewMode === 'central' ? "Population Growth Trend (Crores)" : "Most Populous States (Crores)"}
                    </h2>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${viewMode === 'central' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {viewMode === 'central' ? "NATIONAL TREND" : "STATE COMPARISON"}
                    </span>
                </div>
                <div className="h-[350px] w-full">
                    <SectorBarChart
                        key={viewMode}
                        data={chartData}
                        xAxisKey={xAxisKey}
                        barKey={barKey}
                        fillColor={chartColor}
                    />
                </div>
            </div>

            {/* State-wise Data Grid - Only show in State mode */}
            {viewMode === 'state' && (
                <div className="card mb-8 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">State-wise Detailed Metrics</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {statePopulationData.map((item, index) => (
                            <div
                                key={index}
                                className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:shadow-md transition-all cursor-pointer"
                            >
                                <h3 className="font-bold text-lg mb-3">{item.state}</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Population</span>
                                        <span className="font-semibold">{item.population}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Youth Unemployment</span>
                                        <span className={`font-semibold ${parseFloat(item.unemployment) > 15 ? "text-verification-fake" : "text-verification-real"
                                            }`}>
                                            {item.unemployment}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MIGRATION: Map + Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
                <div className="card h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Migration Patterns</h2>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">LIVE MOCK DATA</span>
                    </div>
                    <MigrationMap />
                </div>

                <div className="card h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Key Insights</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <span className="text-2xl">⚠️</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">High Outflow States</h4>
                                <p className="text-sm text-gray-600 mb-2">UP and Bihar show net outflow in labor migration.</p>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-gray-500">UP: <span className="font-semibold text-red-600">-2.3M</span></span>
                                    <span className="text-gray-500">Bihar: <span className="font-semibold text-red-600">-1.8M</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                            <span className="text-2xl">✓</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">Net Inflow Hubs</h4>
                                <p className="text-sm text-gray-600 mb-2">Maharashtra, Delhi, and Karnataka attract talent inflows.</p>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-gray-500">MH: <span className="font-semibold text-green-600">+3.1M</span></span>
                                    <span className="text-gray-500">DL: <span className="font-semibold text-green-600">+2.4M</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                            <span className="text-2xl">📊</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">Migration Trends</h4>
                                <p className="text-sm text-gray-600 mb-2">Inter-state migration increased by 18% in the last 5 years.</p>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-gray-500">Peak Age: <span className="font-semibold text-indigo-600">20-35 yrs</span></span>
                                    <span className="text-gray-500">Duration: <span className="font-semibold text-indigo-600">Avg 8 yrs</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                            <span className="text-2xl">🏙️</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">Urbanization Impact</h4>
                                <p className="text-sm text-gray-600 mb-2">Cities absorbing 40% of all interstate migrants annually.</p>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-gray-500">Top Cities: <span className="font-semibold text-purple-600">Mumbai, Delhi NCR</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                            <span className="text-2xl">💰</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">Economic Drivers</h4>
                                <p className="text-sm text-gray-600 mb-2">Employment opportunity is primary reason for 78% of migrants.</p>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-gray-500">Sectors: <span className="font-semibold text-orange-600">IT, Retail, Manufacturing</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GIG ECONOMY & FUTURE OF WORK SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gig Economy Stats */}
                <div className="card bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
                    <div className="flex items-center gap-3 mb-6">
                        <Laptop className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Future of Work: Gig & Platform Economy</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-gray-300 text-sm mb-1">Total Gig Workforce</p>
                            <p className="text-3xl font-bold text-white mb-2">77 Lakh</p>
                            <p className="text-xs text-purple-300">Projected to reach 2.35 Cr by 2030 (NITI Aayog)</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-gray-300 text-sm mb-1">Top Sector</p>
                            <div className="flex items-center gap-2 mb-2">
                                <Smartphone className="w-5 h-5 text-green-400" />
                                <p className="text-2xl font-bold text-white">Retail & Delivery</p>
                            </div>
                            <p className="text-xs text-green-300">28 Lakh Workers currently engaged</p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-gray-300 text-sm mb-1">Growth Rate</p>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <p className="text-3xl font-bold text-white">11.5% CAGR</p>
                            </div>
                            <p className="text-xs text-blue-300">Outpacing traditional employment</p>
                        </div>
                    </div>
                </div>

                {/* Additional Key Insight */}
                <div className="card h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Economic Impact</h2>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <span className="text-2xl">ℹ️</span>
                            <div>
                                <h4 className="font-semibold text-sm">Urban Opportunity</h4>
                                <p className="text-sm text-gray-600">Net inflow aligns to metro job creation in IT, logistics, services.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                            <span className="text-2xl">💼</span>
                            <div>
                                <h4 className="font-semibold text-sm">Platform Economy Growth</h4>
                                <p className="text-sm text-gray-600">Digital platforms creating new employment opportunities across urban and rural areas.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                            <span className="text-2xl">📈</span>
                            <div>
                                <h4 className="font-semibold text-sm">Flexible Workforce</h4>
                                <p className="text-sm text-gray-600">Gig economy offers flexibility and supplemental income to millions of workers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })} • Data source: data.gov.in
            </div>
        </DashboardLayout>
    );
}
