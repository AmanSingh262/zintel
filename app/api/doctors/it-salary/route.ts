import { NextResponse } from "next/server";
import { fetchDataGovAPI, generateMockITWorkerData } from "@/lib/dataGovAPI";

export async function GET() {
    try {
        // For now, use mock data since we don't have actual resource IDs
        // In production, replace with actual data.gov.in resource ID
        console.log("Fetching IT worker salary data...");

        const mockData = generateMockITWorkerData();

        // Data is already in correct format
        console.log("IT salary index data:", mockData.data);
        return NextResponse.json(mockData.data);

        // Uncomment below when you have the actual resource ID:
        /*
        // Try to fetch from data.gov.in
        // Resource ID for IT worker salary index (replace with actual resource ID)
        const resourceId = "actual-resource-id-here";

        const result = await fetchDataGovAPI({
            resourceId,
            limit: 10,
        });

        // If API fails or no data, use mock data
        if (!result.success || result.data.length === 0) {
            console.log("Using mock data for IT worker salary index");
            const mockData = generateMockITWorkerData();
            return NextResponse.json(mockData.data);
        }

        // Transform data.gov.in response to match our chart format
        const transformedData = result.data.map((item: any) => ({
            year: item.year || item.fiscal_year,
            index: parseFloat(item.salary_index || item.index || "100"),
        }));

        return NextResponse.json(transformedData);
        */
    } catch (error) {
        console.error("API error:", error);
        // Fallback to mock data
        const mockData = generateMockITWorkerData();
        return NextResponse.json(mockData.data);
    }
}
