import type { Product } from "../database/products";
import type {
	SalesRecord,
	ProductStats,
	EconomicMetrics,
	DBSalesRecord
} from "../types/admin";

import {
	getSalesHistory as dbGetSalesHistory,
	addSaleRecord as dbAddSaleRecord
} from "../database/sales";
import {
	getProducts as dbGetProducts,
	updateProductPrice as dbUpdateProductPrice,
	updateProductStock as dbUpdateProductStock
} from "../database/products";

export class AdminService {
	// Product Management - Now using database
	static async getProducts(): Promise<Product[]> {
		try {
			return await dbGetProducts();
		} catch (error) {
			console.error("Failed to fetch products from database:", error);
			return [];
		}
	}

	// Deprecated: Products are now automatically saved to database via individual update functions
	static saveProducts(): void {
		console.warn(
			"saveProducts is deprecated. Use individual update functions for database persistence."
		);
	}

	static async updateProductPrice(
		products: Product[],
		productId: string,
		newPrice: number
	): Promise<Product[]> {
		// Update in database
		const success = await dbUpdateProductPrice(parseInt(productId), newPrice);
		if (!success) {
			console.error("Failed to update product price in database");
			return products; // Return unchanged if database update fails
		}

		// Update local state
		return products.map((product) =>
			product.id === parseInt(productId)
				? { ...product, price: newPrice }
				: product
		);
	}

	static async updateProductStock(
		products: Product[],
		productId: string,
		newStock: number
	): Promise<Product[]> {
		// Update in database
		const success = await dbUpdateProductStock(parseInt(productId), newStock);
		if (!success) {
			console.error("Failed to update product stock in database");
			return products; // Return unchanged if database update fails
		}

		// Update local state
		return products.map((product) =>
			product.id === parseInt(productId)
				? { ...product, stock: newStock }
				: product
		);
	}

	// Sales Management
	static async getSalesHistory(): Promise<SalesRecord[]> {
		console.log("🔄 AdminService.getSalesHistory called");
		const dbSales = await dbGetSalesHistory();
		console.log("📊 Raw database sales:", dbSales);
		console.log("📊 Database sales count:", dbSales.length);

		// Convert DBSalesRecord to SalesRecord for backward compatibility
		const convertedSales = dbSales.map((sale, index) => ({
			productId: sale.product_id.toString(),
			quantity: sale.quantity,
			revenue: sale.revenue,
			timestamp: sale.created_at
				? new Date(sale.created_at).getTime()
				: Date.now() - index * 1000, // Fallback: recent timestamps
			priceAtSale: sale.price_at_sale
		}));

		console.log("📊 Converted sales:", convertedSales);
		return convertedSales;
	}

	static async saveSalesHistory(): Promise<void> {
		// This method is now deprecated - use addSaleRecord instead
		console.warn(
			"saveSalesHistory is deprecated. Use addSaleRecord for individual sales."
		);
	}

	static async addSaleRecord(newSale: DBSalesRecord): Promise<boolean> {
		return await dbAddSaleRecord(newSale);
	}

	// Analytics
	static calculateProductStats(
		productId: string,
		salesHistory: SalesRecord[]
	): ProductStats {
		// Now all sales are in SalesRecord format (productId: string)
		const productSales = salesHistory.filter(
			(sale) => sale.productId === productId
		);

		const totalSold = productSales.reduce(
			(sum, sale) => sum + sale.quantity,
			0
		);
		const totalRevenue = productSales.reduce(
			(sum, sale) => sum + sale.revenue,
			0
		);
		const averagePrice = totalSold > 0 ? totalRevenue / totalSold : 0;

		const priceHistory = productSales.map((sale) => ({
			price: sale.priceAtSale,
			timestamp: sale.timestamp
		}));

		return {
			productId,
			totalSold,
			totalRevenue,
			averagePrice,
			priceHistory
		};
	}

	static calculateEconomicMetrics(
		salesHistory: SalesRecord[],
		products: Product[]
	): EconomicMetrics {
		if (salesHistory.length === 0) {
			return {
				totalRevenue: 0,
				totalTransactions: 0,
				averageTransactionValue: 0,
				marketVolatility: 0,
				priceInflation: 0
			};
		}

		const totalRevenue = salesHistory.reduce(
			(sum, sale) => sum + sale.revenue,
			0
		);
		const totalTransactions = salesHistory.length;
		const averageTransactionValue = totalRevenue / totalTransactions;

		// Calculate market volatility based on price changes
		const priceChanges = products.map((product) => {
			const productSales = salesHistory.filter(
				(sale) => sale.productId === product.id.toString()
			);
			if (productSales.length < 2) return 0;

			const prices = productSales.map((sale) => sale.priceAtSale);
			const priceVariance =
				prices.reduce((sum, price, i) => {
					if (i === 0) return 0;
					return sum + Math.pow(price - prices[i - 1], 2);
				}, 0) /
				(prices.length - 1);

			return Math.sqrt(priceVariance);
		});

		const marketVolatility =
			priceChanges.reduce((sum, vol) => sum + vol, 0) / priceChanges.length;

		// Calculate price inflation (average price increase over time)
		const recentSales = salesHistory.slice(-10); // Last 10 sales
		const oldSales = salesHistory.slice(0, 10); // First 10 sales

		const recentAvgPrice =
			recentSales.reduce((sum, sale) => sum + sale.priceAtSale, 0) /
			recentSales.length;
		const oldAvgPrice =
			oldSales.reduce((sum, sale) => sum + sale.priceAtSale, 0) /
			oldSales.length;
		const priceInflation =
			oldAvgPrice > 0
				? ((recentAvgPrice - oldAvgPrice) / oldAvgPrice) * 100
				: 0;

		return {
			totalRevenue,
			totalTransactions,
			averageTransactionValue,
			marketVolatility,
			priceInflation
		};
	}

	static getTopProducts(salesHistory: SalesRecord[]): ProductStats[] {
		const productIds = [...new Set(salesHistory.map((sale) => sale.productId))];
		return productIds
			.map((id) => this.calculateProductStats(id, salesHistory))
			.sort((a, b) => b.totalSold - a.totalSold)
			.slice(0, 5);
	}

	// Dynamic Pricing System
	static calculateDynamicPrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours: number = 24
	): number {
		const now = Date.now();
		const timeWindow = timeWindowHours * 60 * 60 * 1000; // Convert hours to milliseconds

		// Get recent sales for this product
		const recentSales = salesHistory.filter(
			(sale) =>
				sale.productId === product.id.toString() &&
				now - sale.timestamp <= timeWindow
		);

		const totalRecentSales = recentSales.reduce(
			(sum, sale) => sum + sale.quantity,
			0
		);
		const basePrice = product.price;

		// Dynamic pricing factors
		const demandFactor = this.calculateDemandFactor(totalRecentSales);
		const stockFactor = this.calculateStockFactor(
			product.stock,
			product.initialstock
		);

		// Calculate new price with realistic min/max bounds
		const newPrice = basePrice * demandFactor * stockFactor;
		const minPrice = basePrice * 0.75; // Never go below 75% of original price
		const maxPrice = basePrice * 1.4; // Never go above 140% of original price

		return Math.max(minPrice, Math.min(maxPrice, newPrice));
	}

	static calculateDemandFactor(recentSales: number): number {
		// Realistic demand-based pricing
		if (recentSales >= 8) return 1.15; // +15% for very high demand
		if (recentSales >= 5) return 1.1; // +10% for high demand
		if (recentSales >= 3) return 1.05; // +5% for moderate demand
		if (recentSales >= 1) return 1.0; // Normal price for some demand
		return 0.95; // -5% for no recent sales
	}

	static calculateStockFactor(
		currentStock: number,
		initialStock: number
	): number {
		const stockRatio = currentStock / initialStock;

		// Realistic stock-based pricing (scarcity effect)
		if (stockRatio <= 0.1) return 1.15; // +15% for very low stock (≤10%)
		if (stockRatio <= 0.2) return 1.08; // +8% for low stock (≤20%)
		if (stockRatio <= 0.5) return 1.02; // +2% for medium-low stock (≤50%)
		if (stockRatio >= 0.9) return 0.98; // -2% for high stock (≥90%)
		return 1.0; // Normal price for balanced stock
	}

	static async applyDynamicPricing(
		productId: string,
		products: Product[],
		salesHistory: SalesRecord[]
	): Promise<Product[]> {
		const product = products.find((p) => p.id === parseInt(productId));
		if (!product) return products;

		const newPrice = this.calculateDynamicPrice(product, salesHistory);

		// Only update if price changed significantly (avoid tiny fluctuations)
		const priceChange = Math.abs(newPrice - product.price);
		if (priceChange >= 0.02) {
			// At least 2 cents difference
			console.log(
				`💰 Dynamic pricing: ${product.name} €${product.price.toFixed(
					2
				)} → €${newPrice.toFixed(2)} (${(
					((newPrice - product.price) / product.price) *
					100
				).toFixed(1)}%)`
			);
			return await this.updateProductPrice(products, productId, newPrice);
		}

		return products;
	}
}
