export const STORAGE_KEYS = {
	ADMIN_PRODUCTS: "adminProducts",
	SALES_HISTORY: "salesHistory"
} as const;

export const DEFAULT_BALANCE = 50;
export const DEFAULT_QUANTITY_RANGE = { min: 1, max: 3 };
export const CHART_DISPLAY_LIMIT = 10;

// New admin constants for better validation and UX
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
