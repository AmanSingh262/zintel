/* apiService.js - Data Fetching Layer */
import { mockPopulationData, mockGDPData, trendingTopics, govtFinanceData, economyData, mediaData, exportData, doctorsData, environmentData, socialData } from './mockData.js';
import { geminiService } from './geminiService.js';

const API_CONFIG = {
    useMock: true, // Set to false when ready for real Govt APIs
    apiKey: localStorage.getItem('zintel_api_key') || '',
    baseUrl: 'https://api.data.gov.in/resource'
};

export const apiService = {
    // Utility to simulate network delay for realism
    async delay(ms = 800) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async fetchPopulationData() {
        // Try fetching "Live" estimate from Gemini
        const liveVal = await geminiService.fetchLiveValue("Total Population");
        if (liveVal) {
            return { ...mockPopulationData, total: liveVal };
        }
        // ACTUAL IMPLEMENTATION INTENT:
        // const response = await fetch('https://api.data.gov.in/resource/population-api-key...');

        if (API_CONFIG.useMock) {
            await this.delay();
            return mockPopulationData;
        } else {
            console.warn("Live Government API not configured. Using Mock Data.");
            return mockPopulationData;
        }
    },

    async fetchGovtRealtime() {
        // Placeholder for Future Integration
        console.log("Connecting to data.gov.in...");
    },

    async fetchGDPData() {
        // Try fetching "Live" estimate from Gemini
        const liveVal = await geminiService.fetchLiveValue("GDP in USD Trillion");
        if (liveVal) {
            return { ...mockGDPData, total: liveVal };
        }
        return mockGDPData;
    },

    async fetchTrendingTopics() {
        if (API_CONFIG.useMock) {
            return trendingTopics;
        }
        return trendingTopics;
    }
};
