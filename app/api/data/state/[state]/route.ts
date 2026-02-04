/**
 * State-Specific Data API
 * GET /api/data/state/[state]
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ state: string }> }
) {
    try {
        const { state } = await params;
        const stateName = decodeURIComponent(state);
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Normalize state name (convert kebab-case to Title Case)
        const normalizedState = stateName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const where: any = {
            geographyName: {
                equals: normalizedState,
                mode: 'insensitive'
            }
        };

        if (category) {
            where.category = category;
        }

        const indicators = await prisma.normalizedIndicator.findMany({
            where,
            orderBy: [
                { category: 'asc' },
                { indicatorName: 'asc' },
                { period: 'desc' }
            ],
            take: 2000
        });

        if (indicators.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                state: normalizedState,
                message: `No data found for ${normalizedState}`,
                count: 0
            });
        }

        // Group by category
        const dataByCategory: Record<string, any[]> = {};
        const lastUpdated = indicators[0].lastUpdated;

        for (const ind of indicators) {
            if (!dataByCategory[ind.category]) {
                dataByCategory[ind.category] = [];
            }

            dataByCategory[ind.category].push({
                indicator: ind.indicatorName,
                value: ind.value,
                unit: ind.unit,
                period: ind.period,
                periodType: ind.periodType,
                metadata: ind.metadata ? JSON.parse(ind.metadata) : null,
            });
        }

        return NextResponse.json({
            success: true,
            state: normalizedState,
            data: dataByCategory,
            source: 'data.gov.in',
            lastUpdated,
            count: indicators.length,
            categories: Object.keys(dataByCategory)
        });

    } catch (error: any) {
        console.error('State API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch state data',
                message: error.message
            },
            { status: 500 }
        );
    }
}
