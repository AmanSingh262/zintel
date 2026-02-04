"use client";

import { useState } from "react";

interface ComparisonFiltersProps {
    selectedCountries: string[];
    selectedIndicator: string;
    yearRange: string;
    onCountriesChange: (countries: string[]) => void;
    onIndicatorChange: (indicator: string) => void;
    onYearRangeChange: (range: string) => void;
    onExport: () => void;
}

const countries = [
    "India",
    "USA",
    "China",
    "Japan",
    "Germany",
    "UK",
    "France",
    "Brazil",
    "Russia",
    "Canada",
    "Australia",
    "South Korea",
];

const indicators = [
    "GDP",
    "Population",
    "Unemployment Rate",
    "Inflation Rate",
    "Life Expectancy",
    "Literacy Rate",
    "CO2 Emissions",
    "Foreign Trade",
];

const yearRanges = [
    "2022-2026",
    "2021-2026",
    "2020-2026",
    "2020-2023",
    "2019-2024",
    "2018-2023",
    "2015-2020",
    "2010-2023",
];

export function ComparisonFilters({
    selectedCountries,
    selectedIndicator,
    yearRange,
    onCountriesChange,
    onIndicatorChange,
    onYearRangeChange,
    onExport,
}: ComparisonFiltersProps) {
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const toggleCountry = (country: string) => {
        if (selectedCountries.includes(country)) {
            onCountriesChange(selectedCountries.filter(c => c !== country));
        } else if (selectedCountries.length < 5) {
            onCountriesChange([...selectedCountries, country]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4">Comparison Parameters</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Select multiple indicators and year range for analysis
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end">
                {/* Countries Multi-Select */}
                <div className="relative">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Select Countries/Regions
                    </label>
                    <button
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-left text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {selectedCountries.length > 0
                            ? `${selectedCountries.slice(0, 2).join(", ")}${selectedCountries.length > 2 ? `... (${selectedCountries.length}/5)` : ` (${selectedCountries.length}/5)`}`
                            : "Select countries (up to 5)"}
                    </button>

                    {showCountryDropdown && (
                        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {countries.map((country) => (
                                <label
                                    key={country}
                                    className="flex items-center px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCountries.includes(country)}
                                        onChange={() => toggleCountry(country)}
                                        disabled={
                                            !selectedCountries.includes(country) &&
                                            selectedCountries.length >= 5
                                        }
                                        className="mr-2 sm:mr-3 rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-xs sm:text-sm text-gray-700">{country}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Selected: {selectedCountries.length}/5
                    </p>
                </div>

                {/* Indicator Dropdown */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Select Indicator
                    </label>
                    <select
                        value={selectedIndicator}
                        onChange={(e) => onIndicatorChange(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {indicators.map((indicator) => (
                            <option key={indicator} value={indicator}>
                                {indicator}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year Range Dropdown */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Select Year Range
                    </label>
                    <select
                        value={yearRange}
                        onChange={(e) => onYearRangeChange(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {yearRanges.map((range) => (
                            <option key={range} value={range}>
                                {range}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Export Button */}
                <div>
                    <button
                        onClick={onExport}
                        className="w-full px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                        <i className="ri-download-2-line"></i>
                        <span className="hidden sm:inline">Export Data</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
