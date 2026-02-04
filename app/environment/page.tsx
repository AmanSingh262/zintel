"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LocationFilterBar } from "@/components/environment/LocationFilterBar";
import { AQIPollutionChart } from "@/components/environment/AQIPollutionChart";
import { WaterScarcityMap } from "@/components/environment/WaterScarcityMap";
import { WaterSourceChart } from "@/components/environment/WaterSourceChart";
import { WasteGenerationChart } from "@/components/environment/WasteGenerationChart";
import { ClimateRiskMap } from "@/components/environment/ClimateRiskMap";
import { RajasthanMap } from "@/components/maps/RajasthanMap";
import { IndiaStateMap } from "@/components/maps/IndiaStateMap";
import { StateSelector } from "@/components/maps/StateSelector";

export default function EnvironmentPage() {
    const [selectedState, setSelectedState] = useState("Delhi");
    const [selectedCity, setSelectedCity] = useState("Delhi");

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
                {/* Page Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Environment & Climate
                </h1>

                {/* Location Filter Bar */}
                <LocationFilterBar
                    selectedState={selectedState}
                    selectedCity={selectedCity}
                    onStateChange={setSelectedState}
                    onCityChange={setSelectedCity}
                />

                {/* Dashboard Grid */}
                <div className="space-y-6">
                    {/* AQI Pollution Trends */}
                    <AQIPollutionChart city={selectedCity} />

                    {/* Water Scarcity & Sources Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <WaterScarcityMap />
                        <WaterSourceChart />
                    </div>

                    {/* Waste Generation vs Recycling */}
                    <WasteGenerationChart />

                    {/* Regional Focus: Rajasthan Water Scarcity */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <h2 className="text-lg sm:text-xl font-bold">Regional Focus: Desert Water Crisis</h2>
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold w-fit">HIGH PRIORITY</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                                <div className="bg-slate-950 rounded-xl p-2 sm:p-3 border border-slate-800 h-[300px] sm:h-[420px] flex flex-col">
                                    <div className="mb-2">
                                        <StateSelector value={selectedState} onChange={setSelectedState} />
                                    </div>
                                    <div className="flex-1 min-h-0">
                                        {/* Show generic map for selected state; detailed city dots remain for Rajasthan */}
                                        {selectedState.toLowerCase() === "rajasthan" ? (
                                            <RajasthanMap />
                                        ) : (
                                            <IndiaStateMap state={selectedState} />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-800">
                                    <div>
                                        <p className="text-sm sm:text-base font-semibold text-slate-900">Water stress snapshot</p>
                                        <ul className="mt-2 space-y-1 list-disc list-inside text-slate-700">
                                            <li>Jodhpur &amp; Barmer reporting <span className="font-semibold text-orange-600">severe</span> groundwater depletion.</li>
                                            <li>Surface reservoirs at <span className="font-semibold">38%</span> of seasonal average.</li>
                                            <li>Peak demand vs supply gap: <span className="font-semibold">22%</span> (urban) / <span className="font-semibold">28%</span> (rural).</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-sm sm:text-base font-semibold text-slate-900">Mitigation focus</p>
                                        <ul className="mt-2 space-y-1 list-disc list-inside text-slate-700">
                                            <li>Accelerate drip irrigation adoption in western districts.</li>
                                            <li>Recharge structures along Luni &amp; seasonal nallas before monsoon.</li>
                                            <li>Micro-grid desal pilots for arid blocks (under evaluation).</li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">Scarcity</span>
                                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Recharge</span>
                                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Efficiency</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Climate Risk Index Map */}
                    <ClimateRiskMap />
                </div>
            </div>
        </DashboardLayout>
    );
}
