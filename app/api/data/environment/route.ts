/**
 * Environment Data API
 * GET /api/data/environment
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state');
        const city = searchParams.get('city');
        const indicator = searchParams.get('indicator'); // aqi, water, waste

        const where: any = {
            category: 'environment'
        };

        if (city) {
            where.geographyName = city;
            where.geography = 'District';
        } else if (state) {
            where.geographyName = state;
        }

        if (indicator) {
            const indicatorMap: Record<string, string> = {
                'aqi': 'Air Quality Index',
                'water': 'Water Scarcity Index',
                'waste': 'Municipal Solid Waste'
            };

            const actualIndicator = indicatorMap[indicator.toLowerCase()] || indicator;
            where.indicatorName = {
                contains: actualIndicator,
                mode: 'insensitive'
            };
        }

        const indicators = await prisma.normalizedIndicator.findMany({
            where,
            orderBy: [
                { geographyName: 'asc' },
                { period: 'desc' },
                { indicatorName: 'asc' }
            ],
            take: 1000
        });

        const lastUpdated = indicators.length > 0
            ? indicators[0].lastUpdated
            : new Date();

        const data = indicators.map(ind => ({
            indicator: ind.indicatorName,
            value: ind.value,
            unit: ind.unit,
            geography: ind.geography,
            location: ind.geographyName,
            period: ind.period,
            periodType: ind.periodType,
            metadata: ind.metadata ? JSON.parse(ind.metadata) : null,
        }));

        return NextResponse.json({
            success: true,
            data,
            source: 'data.gov.in',
            category: 'environment',
            lastUpdated,
            count: data.length,
            filters: {
                state: state || 'all',
                city: city || 'all',
                indicator: indicator || 'all'
            }
        });

    } catch (error: any) {
        console.error('Environment API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch environment data',
                message: error.message
            },
            { status: 500 }
        );
    }
}
