/**
 * Utility functions for handling timestamps and data freshness
 */

/**
 * Format timestamp to Indian date format
 * @param timestamp - ISO timestamp or Date object
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatIndianDate = (timestamp: string | Date): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Format timestamp to Indian date and time format
 * @param timestamp - ISO timestamp or Date object
 * @returns Formatted date and time string
 */
export const formatIndianDateTime = (timestamp: string | Date): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param timestamp - ISO timestamp or Date object
 * @returns Relative time string
 */
export const getRelativeTime = (timestamp: string | Date): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatIndianDate(date);
};

/**
 * Get current timestamp in ISO format
 * @returns Current timestamp as ISO string
 */
export const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
};

/**
 * Check if data is stale (older than specified days)
 * @param timestamp - ISO timestamp or Date object
 * @param maxAgeDays - Maximum age in days before considered stale
 * @returns True if data is stale
 */
export const isDataStale = (timestamp: string | Date, maxAgeDays: number = 30): boolean => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    return diffDays > maxAgeDays;
};
