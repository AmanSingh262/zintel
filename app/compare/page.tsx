"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ComparisonFilters } from "@/components/compare/ComparisonFilters";
import { MainComparisonChart } from "@/components/compare/MainComparisonChart";
import { GDPCompositionChart } from "@/components/compare/GDPCompositionChart";
import { PopulationTrendChart } from "@/components/compare/PopulationTrendChart";
import { SummaryDataTable } from "@/components/compare/SummaryDataTable";
import { PeopleComparisonCard } from "@/components/compare/PeopleComparisonCard";
import { IndividualImpactCalculator } from "@/components/compare/IndividualImpactCalculator";

export default function ComparePage() {
    const [selectedCountries, setSelectedCountries] = useState<string[]>(["India", "USA", "China"]);
    const [selectedIndicator, setSelectedIndicator] = useState("GDP");
    const [yearRange, setYearRange] = useState("2022-2026");

    const handleExport = () => {
        // Export functionality - download CSV/PDF
        console.log("Exporting data...");
        alert("Export feature coming soon!");
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-4 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Global Data Comparison
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Compare India's key economic and social indicators with other nations.
                    </p>
                </div>

                {/* Comparison Filters */}
                <ComparisonFilters
                    selectedCountries={selectedCountries}
                    selectedIndicator={selectedIndicator}
                    yearRange={yearRange}
                    onCountriesChange={setSelectedCountries}
                    onIndicatorChange={setSelectedIndicator}
                    onYearRangeChange={setYearRange}
                    onExport={handleExport}
                />

                {/* Main Comparison Section */}
                <div className="mb-3 sm:mb-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        Comparison of {selectedIndicator} ({yearRange})
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Comparison of selected indicator across countries
                    </p>
                </div>

                {/* Main Comparison Chart */}
                <MainComparisonChart
                    countries={selectedCountries}
                    indicator={selectedIndicator}
                    yearRange={yearRange}
                />

                {/* Two Column Layout for Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <GDPCompositionChart countries={selectedCountries} />
                    <PopulationTrendChart countries={selectedCountries} />
                </div>

                {/* Summary Data Table */}
                <SummaryDataTable
                    countries={selectedCountries}
                    indicator={selectedIndicator}
                    yearRange={yearRange}
                />

                {/* People-to-People Comparison */}
                {selectedCountries.length >= 2 && (
                    <div className="mt-4 sm:mt-6">
                        <PeopleComparisonCard countries={selectedCountries} />
                    </div>
                )}

                {/* Individual Impact Calculator (Enhanced with Framer Motion) */}
                {selectedCountries.length >= 2 && (
                    <div className="mt-4 sm:mt-6">
                        <IndividualImpactCalculator countries={selectedCountries} />
                    </div>
                )}

                {/* Insights Section */}
                <div className="mt-4 sm:mt-6 bg-purple-50 border-l-4 border-purple-600 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg font-bold text-purple-900 mb-2">
                        💡 More insights coming soon!
                    </h3>
                    <p className="text-sm text-purple-700">
                        Interactive ratio charts, custom aggregations, and more data points.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
