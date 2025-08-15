import type { Product } from "../database/products";

export interface SalesRecord {
	productId: string;
	quantity: number;
	revenue: number;
	timestamp: number;
	priceAtSale: number;
}

export interface ProductStats {
	productId: string;
	totalSold: number;
	totalRevenue: number;
	averagePrice: number;
	priceHistory: { price: number; timestamp: number }[];
}

export interface EconomicMetrics {
	totalRevenue: number;
	totalTransactions: number;
	averageTransactionValue: number;
	marketVolatility: number;
	priceInflation: number;
}

export interface AdminState {
	products: Product[];
	salesHistory: SalesRecord[];
	selectedProduct: string;
	economicMetrics: EconomicMetrics;
}
