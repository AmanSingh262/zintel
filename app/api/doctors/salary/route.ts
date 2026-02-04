import { NextResponse } from "next/server";
import { fetchDataGovAPI, generateMockDoctorData } from "@/lib/dataGovAPI";

export async function GET() {
    try {
        // For now, use mock data since we don't have actual resource IDs
        // In production, replace with actual data.gov.in resource ID
        console.log("Fetching doctor salary data...");

        const mockData = generateMockDoctorData();

        // Transform to match chart expectations
        const transformedData = mockData.data.map((item: any) => ({
            state: item.state_code,
            salary: item.avg_salary, // Chart expects 'salary' field
        }));

        console.log("Doctor salary data:", transformedData);
        return NextResponse.json(transformedData);

        // Uncomment below when you have the actual resource ID:
        /*
        const result = await fetchDataGovAPI({
            resourceId: "actual-resource-id-here",
            limit: 50,
        });

        if (!result.success || result.data.length === 0) {
            // Fallback to mock data
            const mockData = generateMockDoctorData();
            return NextResponse.json(mockData.data.map((item: any) => ({
                state: item.state_code,
                salary: item.avg_salary,
            })));
        }

        const transformedData = result.data.map((item: any) => ({
            state: item.state_code || item.state?.substring(0, 2)?.toUpperCase() || "UK",
            salary: parseFloat(item.avg_salary || item.salary || "0"),
        }));

        return NextResponse.json(transformedData);
        */
    } catch (error) {
        console.error("API error:", error);
        // Fallback to mock data
        const mockData = generateMockDoctorData();
        return NextResponse.json(mockData.data);
    }
}
