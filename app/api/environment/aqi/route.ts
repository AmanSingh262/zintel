import { NextResponse } from "next/server";
import { getCityAverageAQI } from "@/lib/services/aqiFetcher";

// Always treat as dynamic so we don't cache AQI responses
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AQIData {
    day: string;
    aqi: number;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city") || "delhi";
        const realtime = searchParams.get("realtime") !== "false"; // Default to true

        console.log(`Fetching AQI data for ${city}...`);

        // Try to fetch real-time data from OGD API
        if (realtime) {
            console.log(`[AQI API] Attempting to fetch real-time data for ${city}...`);
            try {
                const realtimeData = await getCityAverageAQI(city);
                
                console.log(`[AQI API] Response received:`, realtimeData);
                
                if (realtimeData && realtimeData.aqi > 0) {
                    console.log(`✅ Real-time AQI for ${city}: ${realtimeData.aqi} (${realtimeData.health_status})`);
                    console.log(`   Stations: ${realtimeData.station_count}`);
                    console.log(`   PM2.5: ${realtimeData.pollutants?.pm2_5?.value || 'N/A'}`);
                    
                    // Generate 7-day trend based on current AQI (simulate trend)
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    const currentAqi = realtimeData.aqi;
                    
                    const chartData: AQIData[] = days.map((day, idx) => {
                        // Last day is current, others vary ±20%
                        if (idx === 6) {
                            return { day, aqi: Math.round(currentAqi) };
                        }
                        const variance = 0.8 + Math.random() * 0.4; // 80-120% of current
                        return { 
                            day, 
                            aqi: Math.round(currentAqi * variance)
                        };
                    });
                    
                    console.log(`[AQI API] Returning chart data:`, chartData);
                    return NextResponse.json(chartData);
                } else {
                    console.warn(`⚠️ Real-time data unavailable or invalid for ${city} (AQI: ${realtimeData?.aqi || 0})`);
                }
            } catch (error) {
                console.error("❌ Error fetching real-time AQI, falling back to mock data:", error);
            }
        }

        // Fallback to mock data if real-time fetch fails or is disabled
        console.log(`⚠️ [AQI API] Using mock data for ${city} (realtime=${realtime})`);
        const mockData: AQIData[] = [
            { day: "Mon", aqi: 142 },
            { day: "Tue", aqi: 198 },
            { day: "Wed", aqi: 175 },
            { day: "Thu", aqi: 156 },
            { day: "Fri", aqi: 234 },
            { day: "Sat", aqi: 312 },
            { day: "Sun", aqi: 287 },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        
        // Return empty array on error
        return NextResponse.json([
            { day: "Mon", aqi: 0 },
            { day: "Tue", aqi: 0 },
            { day: "Wed", aqi: 0 },
            { day: "Thu", aqi: 0 },
            { day: "Fri", aqi: 0 },
            { day: "Sat", aqi: 0 },
            { day: "Sun", aqi: 0 },
        ]);
    }
}
