/**
 * Background Data Refresh Worker
 * Runs on a 20-minute cycle to keep data fresh
 */

import { getDataFetchEngine } from '../lib/data-fetch-engine';

const REFRESH_INTERVAL = parseInt(process.env.DATA_REFRESH_INTERVAL || '20') * 60 * 1000; // Convert minutes to ms

async function runRefreshCycle() {
    console.log('\n' + '='.repeat(60));
    console.log(`🔄 Data Refresh Cycle Started - ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    const engine = getDataFetchEngine();

    try {
        const results = await engine.fetchDueDatasets();

        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'failed').length;
        const totalRecords = results.reduce((sum, r) => sum + r.recordsFetched, 0);
        const totalIndicators = results.reduce((sum, r) => sum + r.indicatorsCreated, 0);

        console.log('\n' + '='.repeat(60));
        console.log('📊 Refresh Cycle Summary');
        console.log('='.repeat(60));
        console.log(`✅ Total Datasets Processed: ${results.length}`);
        console.log(`   Successful: ${successful}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Records Fetched: ${totalRecords.toLocaleString()}`);
        console.log(`   Indicators Created: ${totalIndicators.toLocaleString()}`);
        console.log(`   Completed: ${new Date().toISOString()}`);
        console.log('='.repeat(60) + '\n');

        if (failed > 0) {
            console.warn(`⚠️  Warning: ${failed} dataset(s) failed to fetch`);
            const failedDatasets = results
                .filter(r => r.status === 'failed')
                .map(r => `${r.datasetId}: ${r.error}`)
                .join('\n');
            console.warn(failedDatasets);
        }

    } catch (error: any) {
        console.error('❌ Fatal error in refresh cycle:', error);
    } finally {
        await engine.disconnect();
    }
}

async function startWorker() {
    console.log('\n🚀 ZINTEL Data Platform Worker Starting...');
    console.log(`   Refresh Interval: ${REFRESH_INTERVAL / 1000 / 60} minutes`);
    console.log(`   Server Time: ${new Date().toISOString()}\n`);

    // Run immediately on startup
    await runRefreshCycle();

    // Then run on interval
    setInterval(async () => {
        await runRefreshCycle();
    }, REFRESH_INTERVAL);

    console.log('✅ Worker is running. Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Received SIGINT, shutting down gracefully...');
    const engine = getDataFetchEngine();
    await engine.disconnect();
    console.log('✅ Worker stopped');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️  Received SIGTERM, shutting down gracefully...');
    const engine = getDataFetchEngine();
    await engine.disconnect();
    console.log('✅ Worker stopped');
    process.exit(0);
});

// Start the worker
startWorker().catch(error => {
    console.error('❌ Worker failed to start:', error);
    process.exit(1);
});
