"use client";

import { useState } from "react";

interface FilterBarProps {
    selectedState: string;
    selectedCity: string;
    onStateChange: (state: string) => void;
    onCityChange: (city: string) => void;
}

const states = [
    "All India",
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "West Bengal",
    "Gujarat",
    "Rajasthan",
    "Punjab",
    "Kerala",
    "Telangana",
    "Andhra Pradesh",
    "Madhya Pradesh",
    "Bihar",
];

const citiesByState: Record<string, string[]> = {
    "All India": ["All Cities"],
    "Delhi": ["Delhi"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru"],
    "Tamil Nadu": ["Chennai"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra"],
    "West Bengal": ["Kolkata"],
    "Gujarat": ["Ahmedabad", "Vadodara"],
    "Rajasthan": ["Jaipur"],
    "Punjab": ["Ludhiana"],
    "Kerala": ["Thiruvananthapuram", "Kochi"],
    "Telangana": ["Hyderabad"],
    "Andhra Pradesh": ["Visakhapatnam"],
    "Madhya Pradesh": ["Indore", "Bhopal"],
    "Bihar": ["Patna"],
};

export function LocationFilterBar({ selectedState, selectedCity, onStateChange, onCityChange }: FilterBarProps) {
    const cities = citiesByState[selectedState] || ["All Cities"];

    const handleStateChange = (newState: string) => {
        onStateChange(newState);
        // Automatically set the first city of the new state
        const newStateCities = citiesByState[newState] || ["All Cities"];
        onCityChange(newStateCities[0]);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
                {/* Filter Label */}
                <div className="flex items-center gap-2">
                    <i className="ri-map-pin-line text-purple-600 text-lg sm:text-xl"></i>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">Filter by Location:</span>
                </div>

                {/* State Dropdown */}
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">State:</label>
                    <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                    >
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City Dropdown */}
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">City:</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                        disabled={selectedState === "All India"}
                    >
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Active Filters Badge */}
                {selectedState !== "All India" && (
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                        <span className="text-xs text-gray-500 hidden sm:inline">Showing data for:</span>
                        <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold flex-1 sm:flex-initial text-center">
                            {selectedCity}, {selectedState}
                        </span>
                        <button
                            onClick={() => {
                                onStateChange("All India");
                                onCityChange("All Cities");
                            }}
                            className="text-xs text-gray-500 hover:text-red-600 transition"
                        >
                            <i className="ri-close-circle-line text-lg"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
