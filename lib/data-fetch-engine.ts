/**
 * Data Fetch Engine
 * Orchestrates fetching data from data.gov.in, normalizing it, and storing in MongoDB
 */

import { PrismaClient } from '@prisma/client';
import { getDataGovClient } from './data-gov-client';
import { getDatasetLoader, type Dataset } from './dataset-loader';
import { getDataNormalizer, type NormalizedIndicator } from './data-normalizer';

const MAX_RETRIES = parseInt(process.env.DATA_RETRY_MAX || '3');
const RETRY_DELAY_MS = 2000;

export interface FetchResult {
    datasetId: string;
    status: 'success' | 'failed' | 'partial';
    recordsFetched: number;
    indicatorsCreated: number;
    duration: number;
    error?: string;
}

export class DataFetchEngine {
    private prisma: PrismaClient;
    private dataGovClient: ReturnType<typeof getDataGovClient>;
    private datasetLoader: ReturnType<typeof getDatasetLoader>;
    private normalizer: ReturnType<typeof getDataNormalizer>;

    constructor() {
        this.prisma = new PrismaClient();
        this.dataGovClient = getDataGovClient();
        this.datasetLoader = getDatasetLoader();
        this.normalizer = getDataNormalizer();
    }

    /**
     * Fetch and process a single dataset
     */
    async fetchDataset(datasetId: string): Promise<FetchResult> {
        const startTime = Date.now();
        const dataset = this.datasetLoader.getDataset(datasetId);

        if (!dataset) {
            return {
                datasetId,
                status: 'failed',
                recordsFetched: 0,
                indicatorsCreated: 0,
                duration: 0,
                error: `Dataset ${datasetId} not found in registry`,
            };
        }

        console.log(`\n🚀 Fetching dataset: ${dataset.name} (${datasetId})`);
        console.log(`   Resource ID: ${dataset.resourceId}`);
        console.log(`   Category: ${dataset.category}`);

        // Create fetch log entry
        const fetchLogData = {
            dataset: {
                connect: { datasetId: dataset.datasetId }
            },
            status: 'running' as const,
            startedAt: new Date(),
        };

        let fetchLog;
        try {
            // Ensure dataset exists in registry table
            await this.ensureDatasetInRegistry(dataset);

            const registryEntry = await this.prisma.datasetRegistry.findUnique({
                where: { datasetId: dataset.datasetId }
            });

            if (!registryEntry) {
                throw new Error(`Failed to find or create registry entry for ${datasetId}`);
            }

            fetchLog = await this.prisma.dataFetchLog.create({
                data: {
                    datasetId: registryEntry.id,
                    status: 'running',
                    startedAt: new Date(),
                }
            });
        } catch (error: any) {
            console.error(`❌ Failed to create fetch log:`, error.message);
            return {
                datasetId,
                status: 'failed',
                recordsFetched: 0,
                indicatorsCreated: 0,
                duration: Date.now() - startTime,
                error: error.message,
            };
        }

        try {
            // Fetch raw data with retries
            const rawData = await this.fetchWithRetry(dataset.resourceId);

            if (!rawData || rawData.length === 0) {
                console.log(`⚠️  No data returned for ${datasetId}`);
                await this.updateFetchLog(fetchLog.id, 'success', 0, 'No data available');
                return {
                    datasetId,
                    status: 'success',
                    recordsFetched: 0,
                    indicatorsCreated: 0,
                    duration: Date.now() - startTime,
                };
            }

            // Normalize data
            const normalizedIndicators = this.normalizer.normalize(
                rawData,
                dataset.normalizationType,
                dataset.datasetId,
                dataset.category
            );

            // Store normalized indicators
            let indicatorsCreated = 0;
            if (normalizedIndicators.length > 0) {
                indicatorsCreated = await this.storeIndicators(normalizedIndicators, dataset.datasetId);
            }

            // Update fetch log
            await this.updateFetchLog(fetchLog.id, 'success', rawData.length);

            // Update dataset last fetched time
            await this.prisma.datasetRegistry.update({
                where: { datasetId: dataset.datasetId },
                data: { lastFetched: new Date() }
            });

            const duration = Date.now() - startTime;
            console.log(`✅ Successfully processed ${dataset.name}`);
            console.log(`   Records: ${rawData.length}, Indicators: ${indicatorsCreated}, Duration: ${duration}ms`);

            return {
                datasetId,
                status: 'success',
                recordsFetched: rawData.length,
                indicatorsCreated,
                duration,
            };

        } catch (error: any) {
            console.error(`❌ Failed to fetch ${dataset.name}:`, error.message);
            await this.updateFetchLog(fetchLog.id, 'failed', 0, error.message);

            return {
                datasetId,
                status: 'failed',
                recordsFetched: 0,
                indicatorsCreated: 0,
                duration: Date.now() - startTime,
                error: error.message,
            };
        }
    }

    /**
     * Fetch all datasets in registry
     */
    async fetchAllDatasets(): Promise<FetchResult[]> {
        const datasets = this.datasetLoader.getAllDatasets();
        console.log(`\n📦 Fetching all datasets (${datasets.length} total)\n`);

        const results: FetchResult[] = [];

        for (const dataset of datasets) {
            const result = await this.fetchDataset(dataset.datasetId);
            results.push(result);

            // Pause between datasets to respect rate limits
            await this.delay(1000);
        }

        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'failed').length;

        console.log(`\n📊 Fetch Summary:`);
        console.log(`   Total: ${results.length}`);
        console.log(`   ✅ Successful: ${successful}`);
        console.log(`   ❌ Failed: ${failed}`);

        return results;
    }

    /**
     * Fetch datasets due for refresh
     */
    async fetchDueDatasets(): Promise<FetchResult[]> {
        // Get last fetch times from database
        const registryEntries = await this.prisma.datasetRegistry.findMany({
            where: { isActive: true }
        });

        const lastFetchTimes = new Map<string, Date>();
        for (const entry of registryEntries) {
            if (entry.lastFetched) {
                lastFetchTimes.set(entry.datasetId, entry.lastFetched);
            }
        }

        const dueDatasets = this.datasetLoader.getDatasetsDueForRefresh(lastFetchTimes);

        if (dueDatasets.length === 0) {
            console.log('✅ All datasets are up to date');
            return [];
        }

        console.log(`\n🔄 Refreshing ${dueDatasets.length} datasets due for update\n`);

        const results: FetchResult[] = [];
        for (const dataset of dueDatasets) {
            const result = await this.fetchDataset(dataset.datasetId);
            results.push(result);
            await this.delay(1000);
        }

        return results;
    }

    /**
     * Fetch with exponential backoff retry
     */
    private async fetchWithRetry(resourceId: string, attempt = 1): Promise<any[]> {
        try {
            return await this.dataGovClient.fetchAllPages(resourceId);
        } catch (error: any) {
            if (attempt >= MAX_RETRIES) {
                throw error;
            }

            const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
            console.log(`   ⚠️  Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await this.delay(delay);
            return this.fetchWithRetry(resourceId, attempt + 1);
        }
    }

    /**
     * Store normalized indicators in database
     */
    private async storeIndicators(indicators: NormalizedIndicator[], datasetId: string): Promise<number> {
        // Delete old indicators for this dataset to avoid duplicates
        await this.prisma.normalizedIndicator.deleteMany({
            where: { sourceDataset: datasetId }
        });

        // Batch insert new indicators
        const batchSize = 100;
        let totalInserted = 0;

        for (let i = 0; i < indicators.length; i += batchSize) {
            const batch = indicators.slice(i, i + batchSize);
            await this.prisma.normalizedIndicator.createMany({
                data: batch.map(ind => ({
                    indicatorName: ind.indicatorName,
                    value: ind.value,
                    unit: ind.unit,
                    geography: ind.geography,
                    geographyName: ind.geographyName,
                    period: ind.period,
                    periodType: ind.periodType,
                    sourceDataset: ind.sourceDataset,
                    category: ind.category,
                    metadata: ind.metadata ? JSON.stringify(ind.metadata) : null,
                }))
            });
            totalInserted += batch.length;
        }

        return totalInserted;
    }

    /**
     * Ensure dataset exists in registry table
     */
    private async ensureDatasetInRegistry(dataset: Dataset): Promise<void> {
        await this.prisma.datasetRegistry.upsert({
            where: { datasetId: dataset.datasetId },
            update: {
                name: dataset.name,
                resourceId: dataset.resourceId,
                category: dataset.category,
                refreshInterval: dataset.refreshInterval,
                normalizationType: dataset.normalizationType,
            },
            create: {
                datasetId: dataset.datasetId,
                name: dataset.name,
                resourceId: dataset.resourceId,
                category: dataset.category,
                refreshInterval: dataset.refreshInterval,
                normalizationType: dataset.normalizationType,
            }
        });
    }

    /**
     * Update fetch log entry
     */
    private async updateFetchLog(
        id: string,
        status: 'success' | 'failed' | 'partial',
        recordsFetched: number,
        errorMessage?: string
    ): Promise<void> {
        await this.prisma.dataFetchLog.update({
            where: { id },
            data: {
                status,
                recordsFetched,
                errorMessage,
                completedAt: new Date(),
            }
        });
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clean up
     */
    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }
}

// Singleton instance
let engineInstance: DataFetchEngine | null = null;

export function getDataFetchEngine(): DataFetchEngine {
    if (!engineInstance) {
        engineInstance = new DataFetchEngine();
    }
    return engineInstance;
}
