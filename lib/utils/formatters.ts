/**
 * Utility functions for formatting currency and numbers according to Indian standards
 */

/**
 * Format number as Indian Rupees with proper symbol
 * @param value - The numeric value to format
 * @returns Formatted string with ₹ symbol
 */
export const formatCurrency = (value: number): string => {
    return `₹${value.toLocaleString('en-IN')}`;
};

/**
 * Convert and format number to Crores (1 Crore = 10,000,000)
 * @param value - The numeric value to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string in Crores with ₹ symbol
 */
export const formatToCrores = (value: number, decimals: number = 2): string => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(decimals)} Cr`;
};

/**
 * Convert and format number to Lakhs (1 Lakh = 100,000)
 * @param value - The numeric value to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string in Lakhs with ₹ symbol
 */
export const formatToLakhs = (value: number, decimals: number = 2): string => {
    const lakhs = value / 100000;
    return `₹${lakhs.toFixed(decimals)} L`;
};

/**
 * Intelligently format number based on magnitude
 * Uses Crores for values >= 1 Crore, Lakhs for values >= 1 Lakh, otherwise full number
 * @param value - The numeric value to format
 * @returns Formatted string with appropriate unit
 */
export const formatIndianCurrency = (value: number): string => {
    if (value >= 10000000) {
        return formatToCrores(value);
    } else if (value >= 100000) {
        return formatToLakhs(value);
    } else {
        return formatCurrency(value);
    }
};

/**
 * Format number without currency symbol (for non-monetary values)
 * @param value - The numeric value to format
 * @returns Formatted string in Crores
 */
export const formatNumberToCrores = (value: number, decimals: number = 2): string => {
    const crores = value / 10000000;
    return `${crores.toFixed(decimals)} Cr`;
};

/**
 * Format number without currency symbol (for non-monetary values)
 * @param value - The numeric value to format
 * @returns Formatted string in Lakhs
 */
export const formatNumberToLakhs = (value: number, decimals: number = 2): string => {
    const lakhs = value / 100000;
    return `${lakhs.toFixed(decimals)} L`;
};

/**
 * Format percentage values
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Convert "Annually" to "Annual" for consistency
 * @param text - Input text
 * @returns Text with "Annually" replaced by "Annual"
 */
export const normalizeTimeframe = (text: string): string => {
    return text.replace(/Annually/gi, 'Annual');
};
