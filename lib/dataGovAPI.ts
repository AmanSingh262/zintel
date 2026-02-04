// Utility for fetching data from data.gov.in API

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const DATA_GOV_API_URL = process.env.DATA_GOV_API_URL || "https://api.data.gov.in/resource";

interface DataGovParams {
    resourceId: string;
    limit?: number;
    offset?: number;
    filters?: Record<string, string>;
}

export async function fetchDataGovAPI(params: DataGovParams) {
    const { resourceId, limit = 100, offset = 0, filters = {} } = params;

    if (!DATA_GOV_API_KEY) {
        throw new Error("DATA_GOV_API_KEY is not configured");
    }

    const url = new URL(`${DATA_GOV_API_URL}/${resourceId}`);
    url.searchParams.set("api-key", DATA_GOV_API_KEY);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", offset.toString());

    // Add custom filters
    Object.entries(filters).forEach(([key, value]) => {
        url.searchParams.set(`filters[${key}]`, value);
    });

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`data.gov.in API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
            success: true,
            data: data.records || [],
            total: data.total || 0,
        };
    } catch (error) {
        console.error("data.gov.in fetch error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            data: [],
            total: 0,
        };
    }
}

// Mock data generator with data.gov.in structure
export function generateMockDoctorData() {
    return {
        success: true,
        data: [
            { state: "Maharashtra", state_code: "M", avg_salary: 1.8, currency: "Cr INR" },
            { state: "Karnataka", state_code: "K", avg_salary: 1.7, currency: "Cr INR" },
            { state: "Delhi", state_code: "D", avg_salary: 2.0, currency: "Cr INR" },
            { state: "Tamil Nadu", state_code: "TN", avg_salary: 1.5, currency: "Cr INR" },
            { state: "Uttar Pradesh", state_code: "UP", avg_salary: 1.2, currency: "Cr INR" },
            { state: "West Bengal", state_code: "WB", avg_salary: 1.1, currency: "Cr INR" },
            { state: "Gujarat", state_code: "G", avg_salary: 1.4, currency: "Cr INR" },
        ],
        total: 7,
    };
}

export function generateMockITWorkerData() {
    return {
        success: true,
        data: [
            { year: "2018", index: 100 },
            { year: "2019", index: 110 },
            { year: "2020", index: 118 },
            { year: "2021", index: 125 },
            { year: "2022", index: 138 },
            { year: "2023", index: 145 },
            { year: "2024", index: 152 },
        ],
        total: 7,
    };
}
