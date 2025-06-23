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