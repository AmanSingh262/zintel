/**
 * One-time Initial Data Sync Script
 * Run this once to populate the database with initial data
 */

import { getDataFetchEngine } from '../lib/data-fetch-engine';
import { getDatasetLoader } from '../lib/dataset-loader';

async function initialSync() {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 ZINTEL Data Platform - Initial Data Sync');
    console.log('='.repeat(70) + '\n');

    const loader = getDatasetLoader();
    const metadata = loader.getMetadata();

    console.log('📋 Registry Information:');
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Last Updated: ${metadata.lastUpdated}`);
    console.log(`   Total Datasets: ${metadata.totalDatasets}`);
    console.log(`   Categories: ${metadata.categories.join(', ')}`);
    console.log('');

    const proceed = process.argv.includes('--force') || process.argv.includes('-f');

    if (!proceed) {
        console.log('⚠️  This will fetch ALL datasets from data.gov.in');
        console.log('   This may take 10-20 minutes depending on data volume.');
        console.log('');
        console.log('   To proceed, run: npm run sync:initial -- --force');
        console.log('');
        return;
    }

    const engine = getDataFetchEngine();

    try {
        console.log('Starting full data sync...\n');
        const startTime = Date.now();

        const results = await engine.fetchAllDatasets();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'failed').length;
        const totalRecords = results.reduce((sum, r) => sum + r.recordsFetched, 0);
        const totalIndicators = results.reduce((sum, r) => sum + r.indicatorsCreated, 0);

        console.log('\n' + '='.repeat(70));
        console.log('📊 Initial Sync Complete');
        console.log('='.repeat(70));
        console.log(`✅ Total Datasets: ${results.length}`);
        console.log(`   Successful: ${successful}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Total Records Fetched: ${totalRecords.toLocaleString()}`);
        console.log(`   Total Indicators Created: ${totalIndicators.toLocaleString()}`);
        console.log(`   Duration: ${duration} seconds`);
        console.log('='.repeat(70) + '\n');

        if (failed > 0) {
            console.warn('\n⚠️  Failed Datasets:');
            results
                .filter(r => r.status === 'failed')
                .forEach(r => {
                    console.warn(`   ❌ ${r.datasetId}: ${r.error}`);
                });
            console.log('');
        }

        console.log('✅ Initial sync completed successfully!');
        console.log('   You can now start the worker with: npm run worker\n');

    } catch (error: any) {
        console.error('\n❌ Initial sync failed:', error.message);
        process.exit(1);
    } finally {
        await engine.disconnect();
    }
}

initialSync().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
