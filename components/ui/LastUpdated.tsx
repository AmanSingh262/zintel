import { formatIndianDate, getRelativeTime } from '@/lib/utils/timestamps';

interface LastUpdatedProps {
    timestamp: string | Date;
    showRelative?: boolean;
    className?: string;
}

/**
 * Component to display "Last Updated" timestamp
 * Shows data freshness for transparency
 */
export function LastUpdated({
    timestamp,
    showRelative = false,
    className = ''
}: LastUpdatedProps) {
    const displayText = showRelative
        ? getRelativeTime(timestamp)
        : `Last Updated: ${formatIndianDate(timestamp)}`;

    return (
        <div className={`text-xs text-gray-500 ${className}`}>
            {displayText}
        </div>
    );
}

/**
 * Component for data source citation
 */
interface DataSourceProps {
    source: string;
    year?: number;
    url?: string;
    className?: string;
}

export function DataSource({ source, year, url, className = '' }: DataSourceProps) {
    const displayText = year ? `${source} (${year})` : source;

    if (url) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs text-blue-600 hover:underline ${className}`}
            >
                Source: {displayText}
            </a>
        );
    }

    return (
        <div className={`text-xs text-gray-500 ${className}`}>
            Source: {displayText}
        </div>
    );
}
