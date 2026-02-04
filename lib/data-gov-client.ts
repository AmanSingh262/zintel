/**
 * Data.gov.in API Client
 * Low-level HTTP client for interacting with data.gov.in APIs
 */

const DATA_GOV_BASE_URL = process.env.DATA_GOV_API_URL || 'https://api.data.gov.in/resource';
const API_KEY = process.env.DATA_GOV_API_KEY;
const REQUEST_TIMEOUT = parseInt(process.env.DATA_FETCH_TIMEOUT || '30000');

export interface DataGovApiResponse {
    records: any[];
    total: number;
    count: number;
    offset: number;
    limit: number;
}

export interface FetchOptions {
    limit?: number;
    offset?: number;
    filters?: Record<string, string>;
    format?: 'json' | 'xml' | 'csv';
}

export class DataGovClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || API_KEY || '';
        this.baseUrl = DATA_GOV_BASE_URL;

        if (!this.apiKey) {
            console.warn('⚠️  Data.gov.in API key not configured. Set DATA_GOV_API_KEY in .env');
        }
    }

    /**
     * Fetch data from a specific resource
     */
    async fetchResource(
        resourceId: string,
        options: FetchOptions = {}
    ): Promise<DataGovApiResponse> {
        const {
            limit = 100,
            offset = 0,
            filters = {},
            format = 'json'
        } = options;

        // Build query parameters
        const params = new URLSearchParams({
            'api-key': this.apiKey,
            format,
            limit: limit.toString(),
            offset: offset.toString(),
        });

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
            params.append(`filters[${key}]`, value);
        });

        const url = `${this.baseUrl}/${resourceId}?${params.toString()}`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ZINTEL-DataPlatform/1.0',
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Validate response structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format from data.gov.in');
            }

            return {
                records: data.records || [],
                total: data.total || 0,
                count: data.count || 0,
                offset: data.offset || offset,
                limit: data.limit || limit,
            };

        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`);
            }
            throw new Error(`Failed to fetch from data.gov.in: ${error.message}`);
        }
    }

    /**
     * Fetch all pages of data for a resource
     */
    async fetchAllPages(
        resourceId: string,
        options: FetchOptions = {}
    ): Promise<any[]> {
        const limit = options.limit || 100;
        let offset = 0;
        let allRecords: any[] = [];
        let hasMore = true;

        console.log(`📥 Fetching all pages for resource: ${resourceId}`);

        while (hasMore) {
            try {
                const response = await this.fetchResource(resourceId, {
                    ...options,
                    limit,
                    offset,
                });

                allRecords = allRecords.concat(response.records);

                console.log(`   Fetched ${response.count} records (offset: ${offset}, total: ${response.total})`);

                // Check if there are more pages
                if (response.count < limit || allRecords.length >= response.total) {
                    hasMore = false;
                } else {
                    offset += limit;
                }

                // Rate limiting: wait 500ms between requests
                if (hasMore) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

            } catch (error: any) {
                console.error(`❌ Error fetching page at offset ${offset}:`, error.message);
                throw error;
            }
        }

        console.log(`✅ Completed fetching ${allRecords.length} total records`);
        return allRecords;
    }

    /**
     * Test API key validity
     */
    async testConnection(testResourceId: string = '9ef84268-d588-465a-a308-a864a43d0070'): Promise<boolean> {
        try {
            await this.fetchResource(testResourceId, { limit: 1 });
            console.log('✅ Data.gov.in API connection successful');
            return true;
        } catch (error: any) {
            console.error('❌ Data.gov.in API connection failed:', error.message);
            return false;
        }
    }
}

// Singleton instance
let clientInstance: DataGovClient | null = null;

export function getDataGovClient(): DataGovClient {
    if (!clientInstance) {
        clientInstance = new DataGovClient();
    }
    return clientInstance;
}
