/**
 * Data Normalizer
 * Converts raw data from data.gov.in into unified NormalizedIndicator format
 */

export interface NormalizedIndicator {
    indicatorName: string;
    value: number;
    unit: string;
    geography: 'National' | 'State' | 'District';
    geographyName: string;
    period: string;
    periodType: 'year' | 'quarter' | 'month';
    sourceDataset: string;
    category: string;
    metadata?: Record<string, any>;
}

/**
 * Base normalizer class
 */
abstract class BaseNormalizer {
    abstract normalize(rawData: any[], sourceDataset: string, category: string): NormalizedIndicator[];

    protected createIndicator(
        name: string,
        value: number,
        unit: string,
        geography: 'National' | 'State' | 'District',
        geographyName: string,
        period: string,
        periodType: 'year' | 'quarter' | 'month',
        sourceDataset: string,
        category: string,
        metadata?: Record<string, any>
    ): NormalizedIndicator {
        return {
            indicatorName: name,
            value,
            unit,
            geography,
            geographyName,
            period,
            periodType,
            sourceDataset,
            category,
            metadata,
        };
    }

    protected parseNumber(value: any): number {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value.replace(/,/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    }

    protected normalizeStateName(name: string): string {
        // Standardize state names
        const mappings: Record<string, string> = {
            'UP': 'Uttar Pradesh',
            'UK': 'Uttarakhand',
            'HP': 'Himachal Pradesh',
            'AP': 'Andhra Pradesh',
            'TN': 'Tamil Nadu',
            'WB': 'West Bengal',
            'MP': 'Madhya Pradesh',
        };
        return mappings[name] || name;
    }
}

/**
 * Population data normalizer
 */
class PopulationNormalizer extends BaseNormalizer {
    normalize(rawData: any[], sourceDataset: string, category: string): NormalizedIndicator[] {
        const indicators: NormalizedIndicator[] = [];

        for (const record of rawData) {
            // Extract common fields (adjust based on actual data.gov.in schema)
            const state = this.normalizeStateName(record.state || record.State || record.state_name || 'India');
            const year = record.year || record.Year || record.census_year || '2024';

            // Population
            if (record.population || record.Population || record.total_population) {
                const popValue = this.parseNumber(record.population || record.Population || record.total_population);
                indicators.push(
                    this.createIndicator(
                        'Population',
                        popValue,
                        'persons',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category,
                        { source: 'Census' }
                    )
                );
            }

            // Rural population
            if (record.rural_population || record.Rural_Population) {
                indicators.push(
                    this.createIndicator(
                        'Rural Population',
                        this.parseNumber(record.rural_population || record.Rural_Population),
                        'persons',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            // Urban population
            if (record.urban_population || record.Urban_Population) {
                indicators.push(
                    this.createIndicator(
                        'Urban Population',
                        this.parseNumber(record.urban_population || record.Urban_Population),
                        'persons',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            // Youth unemployment
            if (record.youth_unemployment || record.unemployment_rate) {
                indicators.push(
                    this.createIndicator(
                        'Youth Unemployment Rate',
                        this.parseNumber(record.youth_unemployment || record.unemployment_rate),
                        'percentage',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }
        }

        return indicators;
    }
}

/**
 * Economy data normalizer
 */
class EconomyNormalizer extends BaseNormalizer {
    normalize(rawData: any[], sourceDataset: string, category: string): NormalizedIndicator[] {
        const indicators: NormalizedIndicator[] = [];

        for (const record of rawData) {
            const state = this.normalizeStateName(record.state || record.State || 'India');
            const year = record.year || record.Year || record.fiscal_year || '2024';

            // GDP
            if (record.gdp || record.GDP || record.gross_state_product) {
                indicators.push(
                    this.createIndicator(
                        'Gross Domestic Product',
                        this.parseNumber(record.gdp || record.GDP || record.gross_state_product),
                        'crores',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            // GDP Growth
            if (record.gdp_growth || record.growth_rate) {
                indicators.push(
                    this.createIndicator(
                        'GDP Growth Rate',
                        this.parseNumber(record.gdp_growth || record.growth_rate),
                        'percentage',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            // Unemployment Rate
            if (record.unemployment_rate || record.unemployment) {
                indicators.push(
                    this.createIndicator(
                        'Unemployment Rate',
                        this.parseNumber(record.unemployment_rate || record.unemployment),
                        'percentage',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            // Per Capita Income
            if (record.per_capita_income || record.income_per_capita) {
                indicators.push(
                    this.createIndicator(
                        'Per Capita Income',
                        this.parseNumber(record.per_capita_income || record.income_per_capita),
                        'rupees',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            // Employment Rate
            if (record.employment_rate) {
                indicators.push(
                    this.createIndicator(
                        'Employment Rate',
                        this.parseNumber(record.employment_rate),
                        'percentage',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }
        }

        return indicators;
    }
}

/**
 * Government finance normalizer
 */
class GovernmentNormalizer extends BaseNormalizer {
    normalize(rawData: any[], sourceDataset: string, category: string): NormalizedIndicator[] {
        const indicators: NormalizedIndicator[] = [];

        for (const record of rawData) {
            const state = this.normalizeStateName(record.state || record.State || 'India');
            const year = record.year || record.Year || record.fiscal_year || '2024';

            if (record.budget_allocation || record.allocation) {
                indicators.push(
                    this.createIndicator(
                        'Budget Allocation',
                        this.parseNumber(record.budget_allocation || record.allocation),
                        'crores',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            if (record.revenue) {
                indicators.push(
                    this.createIndicator(
                        'Government Revenue',
                        this.parseNumber(record.revenue),
                        'crores',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            if (record.expenditure) {
                indicators.push(
                    this.createIndicator(
                        'Government Expenditure',
                        this.parseNumber(record.expenditure),
                        'crores',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }

            if (record.tax_collection) {
                indicators.push(
                    this.createIndicator(
                        'Tax Collection',
                        this.parseNumber(record.tax_collection),
                        'crores',
                        state === 'India' ? 'National' : 'State',
                        state,
                        year.toString(),
                        'year',
                        sourceDataset,
                        category
                    )
                );
            }
        }

        return indicators;
    }
}

/**
 * Environment data normalizer
 */
class EnvironmentNormalizer extends BaseNormalizer {
    normalize(rawData: any[], sourceDataset: string, category: string): NormalizedIndicator[] {
        const indicators: NormalizedIndicator[] = [];

        for (const record of rawData) {
            const location = record.city || record.state || record.location || 'India';
            const period = record.date || record.month || record.year || '2024';
            const periodType = record.date ? 'month' : 'year';

            // AQI
            if (record.aqi || record.AQI || record.air_quality_index) {
                indicators.push(
                    this.createIndicator(
                        'Air Quality Index',
                        this.parseNumber(record.aqi || record.AQI || record.air_quality_index),
                        'index',
                        record.city ? 'District' : 'State',
                        location,
                        period.toString(),
                        periodType,
                        sourceDataset,
                        category
                    )
                );
            }

            // Water scarcity
            if (record.water_scarcity || record.water_availability) {
                indicators.push(
                    this.createIndicator(
                        'Water Scarcity Index',
                        this.parseNumber(record.water_scarcity || record.water_availability),
                        'index',
                        'State',
                        location,
                        period.toString(),
                        periodType,
                        sourceDataset,
                        category
                    )
                );
            }

            // Waste generation
            if (record.waste_generation) {
                indicators.push(
                    this.createIndicator(
                        'Municipal Solid Waste',
                        this.parseNumber(record.waste_generation),
                        'tons/day',
                        record.city ? 'District' : 'State',
                        location,
                        period.toString(),
                        periodType,
                        sourceDataset,
                        category
                    )
                );
            }
        }

        return indicators;
    }
}

/**
 * Generic normalizer for other data types
 */
class GenericNormalizer extends BaseNormalizer {
    normalize(rawData: any[], sourceDataset: string, category: string): NormalizedIndicator[] {
        const indicators: NormalizedIndicator[] = [];

        for (const record of rawData) {
            // Try to extract basic fields
            const state = record.state || record.State || 'India';
            const year = record.year || record.Year || '2024';

            // Find numeric fields
            for (const [key, value] of Object.entries(record)) {
                if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
                    if (key !== 'year' && key !== 'Year') {
                        indicators.push(
                            this.createIndicator(
                                key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                                this.parseNumber(value),
                                'units',
                                state === 'India' ? 'National' : 'State',
                                state,
                                year.toString(),
                                'year',
                                sourceDataset,
                                category
                            )
                        );
                    }
                }
            }
        }

        return indicators;
    }
}

/**
 * Normalizer factory
 */
export class DataNormalizer {
    private normalizers: Map<string, BaseNormalizer>;

    constructor() {
        this.normalizers = new Map([
            ['population', new PopulationNormalizer()],
            ['economy', new EconomyNormalizer()],
            ['government', new GovernmentNormalizer()],
            ['environment', new EnvironmentNormalizer()],
            ['trade', new GenericNormalizer()],
            ['industry', new GenericNormalizer()],
            ['healthcare', new GenericNormalizer()],
        ]);
    }

    /**
     * Normalize raw data based on type
     */
    normalize(
        rawData: any[],
        normalizationType: string,
        sourceDataset: string,
        category: string
    ): NormalizedIndicator[] {
        const normalizer = this.normalizers.get(normalizationType) || this.normalizers.get('generic') || new GenericNormalizer();

        try {
            const normalized = normalizer.normalize(rawData, sourceDataset, category);
            console.log(`✅ Normalized ${normalized.length} indicators from ${rawData.length} raw records (type: ${normalizationType})`);
            return normalized;
        } catch (error: any) {
            console.error(`❌ Normalization failed for type ${normalizationType}:`, error.message);
            return [];
        }
    }
}

// Singleton instance
let normalizerInstance: DataNormalizer | null = null;

export function getDataNormalizer(): DataNormalizer {
    if (!normalizerInstance) {
        normalizerInstance = new DataNormalizer();
    }
    return normalizerInstance;
}
