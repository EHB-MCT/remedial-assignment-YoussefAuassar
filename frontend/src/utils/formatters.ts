/**
 * Formatters utility - Collection of formatting functions for currency, dates, and percentages
 */
export const formatCurrency = (amount: number): string =>
	`€${amount.toFixed(2)}`;

export const formatDate = (timestamp: number): string =>
	new Date(timestamp).toLocaleDateString();

export const formatPercentage = (value: number, decimals: number = 1): string =>
	`${value.toFixed(decimals)}%`;
