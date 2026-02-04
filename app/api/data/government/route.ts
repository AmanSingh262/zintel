/**
 * Government Finance Data API
 * GET /api/data/government
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state');
        const year = searchParams.get('year');
        const indicator = searchParams.get('indicator');

        const where: any = {
            category: 'government'
        };

        if (state) {
            where.geographyName = state;
        }

        if (year) {
            where.period = year;
        }

        if (indicator) {
            const indicatorMap: Record<string, string> = {
                'budget': 'Budget Allocation',
                'revenue': 'Government Revenue',
                'expenditure': 'Government Expenditure',
                'tax': 'Tax Collection'
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
            category: 'government',
            lastUpdated,
            count: data.length,
            filters: {
                state: state || 'all',
                year: year || 'all',
                indicator: indicator || 'all'
            }
        });

    } catch (error: any) {
        console.error('Government API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch government data',
                message: error.message
            },
            { status: 500 }
        );
    }
}
