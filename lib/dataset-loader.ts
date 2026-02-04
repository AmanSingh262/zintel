/**
 * Dataset Registry Loader
 * Loads and provides typed access to dataset metadata
 */

import datasetRegistryJson from '@/config/dataset-registry.json';

export interface Dataset {
    datasetId: string;
    name: string;
    resourceId: string;
    category: string;
    refreshInterval: number; // minutes
    normalizationType: string;
    description: string;
}

export interface DatasetRegistry {
    version: string;
    lastUpdated: string;
    datasets: Dataset[];
    notes: string[];
}

class DatasetLoader {
    private registry: DatasetRegistry;
    private datasetsById: Map<string, Dataset>;
    private datasetsByCategory: Map<string, Dataset[]>;

    constructor() {
        this.registry = datasetRegistryJson as DatasetRegistry;
        this.datasetsById = new Map();
        this.datasetsByCategory = new Map();
        this.indexDatasets();
    }

    private indexDatasets() {
        for (const dataset of this.registry.datasets) {
            // Index by ID
            this.datasetsById.set(dataset.datasetId, dataset);

            // Index by category
            if (!this.datasetsByCategory.has(dataset.category)) {
                this.datasetsByCategory.set(dataset.category, []);
            }
            this.datasetsByCategory.get(dataset.category)!.push(dataset);
        }
    }

    /**
     * Get all datasets
     */
    getAllDatasets(): Dataset[] {
        return this.registry.datasets;
    }

    /**
     * Get dataset by ID
     */
    getDataset(datasetId: string): Dataset | undefined {
        return this.datasetsById.get(datasetId);
    }

    /**
     * Get datasets by category
     */
    getDatasetsByCategory(category: string): Dataset[] {
        return this.datasetsByCategory.get(category) || [];
    }

    /**
     * Get all categories
     */
    getCategories(): string[] {
        return Array.from(this.datasetsByCategory.keys());
    }

    /**
     * Get datasets that need refresh
     */
    getDatasetsDueForRefresh(lastFetchTimes: Map<string, Date>): Dataset[] {
        const now = new Date();
        return this.registry.datasets.filter(dataset => {
            const lastFetch = lastFetchTimes.get(dataset.datasetId);
            if (!lastFetch) return true; // Never fetched

            const minutesSinceLastFetch = (now.getTime() - lastFetch.getTime()) / (1000 * 60);
            return minutesSinceLastFetch >= dataset.refreshInterval;
        });
    }

    /**
     * Get registry metadata
     */
    getMetadata() {
        return {
            version: this.registry.version,
            lastUpdated: this.registry.lastUpdated,
            totalDatasets: this.registry.datasets.length,
            categories: this.getCategories(),
        };
    }
}

// Singleton instance
let loaderInstance: DatasetLoader | null = null;

export function getDatasetLoader(): DatasetLoader {
    if (!loaderInstance) {
        loaderInstance = new DatasetLoader();
    }
    return loaderInstance;
}

export { type Dataset as DatasetConfig };
