/**
 * Data Refresh API (Manual trigger for testing)
 * POST /api/data/refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDataFetchEngine } from '@/lib/data-fetch-engine';

export async function POST(request: NextRequest) {
    try {
        const { datasetId, all } = await request.json();

        const engine = getDataFetchEngine();

        let results;
        if (all) {
            console.log('🔄 Manual refresh triggered for ALL datasets');
            results = await engine.fetchAllDatasets();
        } else if (datasetId) {
            console.log(`🔄 Manual refresh triggered for dataset: ${datasetId}`);
            const result = await engine.fetchDataset(datasetId);
            results = [result];
        } else {
            console.log('🔄 Manual refresh triggered for due datasets');
            results = await engine.fetchDueDatasets();
        }

        await engine.disconnect();

        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'failed').length;

        return NextResponse.json({
            success: true,
            message: 'Data refresh completed',
            summary: {
                total: results.length,
                successful,
                failed
            },
            results
        });

    } catch (error: any) {
        console.error('Refresh API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to refresh data',
                message: error.message
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST method to trigger data refresh',
        endpoints: {
            'POST /api/data/refresh': 'Refresh all due datasets',
            'POST /api/data/refresh { "all": true }': 'Refresh all datasets',
            'POST /api/data/refresh { "datasetId": "..." }': 'Refresh specific dataset'
        }
    });
}
