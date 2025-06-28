// src/utils/formatters.ts
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return 'Invalid Date';
    }
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDuration = (duration?: string): string => {
    if (!duration) return 'N/A';

    try {
        // Convert ISO 8601 duration to hours
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return duration;

        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const seconds = parseInt(match[3] || '0');

        const totalHours = hours + (minutes / 60) + (seconds / 3600);
        return `${totalHours.toFixed(1)} hours`;
    } catch {
        return duration;
    }
};