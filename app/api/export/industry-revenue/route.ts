import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Fetching industry revenue data...");

        // Mock data for industry revenue growth
        const mockData = [
            { year: "2019", itSector: 185, manufacturing: 215, services: 143 },
            { year: "2020", itSector: 198, manufacturing: 198, services: 156 },
            { year: "2021", itSector: 212, manufacturing: 223, services: 178 },
            { year: "2022", itSector: 245, manufacturing: 256, services: 198 },
            { year: "2023", itSector: 278, manufacturing: 289, services: 221 },
            { year: "2024", itSector: 312, manufacturing: 321, services: 245 },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json([]);
    }
}
