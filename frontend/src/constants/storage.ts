/**
 * Configuration constants for the Festival Drink Simulator
 */

// Shop settings
export const DEFAULT_BALANCE = 50; // Starting user balance in euros
export const CHART_DISPLAY_LIMIT = 10; // Max items in charts

// Admin validation constraints
export const ADMIN_CONSTANTS = {
	MAX_PRICE: 1000,
	MAX_STOCK: 10000,
	MIN_PRICE: 0,
	MIN_STOCK: 0,
	PRICE_STEP: 0.1,
	STOCK_STEP: 1,
	PRICE_DECIMAL_PLACES: 2,
	STOCK_DECIMAL_PLACES: 0
} as const;
