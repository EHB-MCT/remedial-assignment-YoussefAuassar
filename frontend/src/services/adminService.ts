import type { Product } from "../database/products";
import type {
	SalesRecord,
	ProductStats,
	EconomicMetrics,
	DBSalesRecord
} from "../types/admin";
import { STORAGE_KEYS, DEFAULT_QUANTITY_RANGE } from "../constants/storage";
import {
	getSalesHistory,
	addSaleRecord as dbAddSaleRecord
} from "../database/sales";
import {
	updateProductPrice as dbUpdateProductPrice,
	updateProductStock as dbUpdateProductStock
} from "../database/products";

export class AdminService {
	// Product Management
	static getProducts(): Product[] {
		const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PRODUCTS);
		return stored ? JSON.parse(stored) : [];
	}

	static saveProducts(products: Product[]): void {
		localStorage.setItem(STORAGE_KEYS.ADMIN_PRODUCTS, JSON.stringify(products));
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

	// Sales Management - NOW USING DATABASE
	static async getSalesHistory(): Promise<SalesRecord[]> {
		const dbSales = await getSalesHistory();
		// Convert DBSalesRecord to SalesRecord for backward compatibility
		return dbSales.map((sale) => ({
			productId: sale.product_id.toString(),
			quantity: sale.quantity,
			revenue: sale.revenue,
			timestamp: Date.now(), // Use current timestamp for old format
			priceAtSale: sale.price_at_sale
		}));
	}

	static async saveSalesHistory(sales: SalesRecord[]): Promise<void> {
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
		// Handle both old localStorage format and new database format
		const productSales = salesHistory.filter((sale) => {
			// Check if it's the old format (productId) or new format (product_id)
			if ("productId" in sale) {
				return sale.productId === productId;
			} else if ("product_id" in sale) {
				return sale.product_id === parseInt(productId);
			}
			return false;
		});

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
			const productSales = salesHistory.filter((sale) => {
				// Handle both old localStorage format and new database format
				if ("productId" in sale) {
					return sale.productId === product.id.toString();
				} else if ("product_id" in sale) {
					return sale.product_id === product.id;
				}
				return false;
			});
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
		const productIds = [
			...new Set(
				salesHistory.map((sale) => {
					// Handle both old localStorage format and new database format
					if ("productId" in sale) {
						return sale.productId;
					} else if ("product_id" in sale) {
						return sale.product_id.toString();
					}
					return "";
				})
			)
		];
		return productIds
			.map((id) => this.calculateProductStats(id, salesHistory))
			.sort((a, b) => b.totalSold - a.totalSold)
			.slice(0, 5);
	}

	// Economy Simulation
	static async simulatePurchase(
		productId: string,
		products: Product[],
		salesHistory: SalesRecord[]
	): Promise<{
		updatedProducts: Product[];
		updatedSales: SalesRecord[];
	}> {
		const product = products.find((p) => p.id === productId);
		if (!product || product.stock <= 0) {
			return { updatedProducts: products, updatedSales: salesHistory };
		}

		const quantity =
			Math.floor(
				Math.random() *
					(DEFAULT_QUANTITY_RANGE.max - DEFAULT_QUANTITY_RANGE.min + 1)
			) + DEFAULT_QUANTITY_RANGE.min;

		// Create sale record for database
		const newSale: DBSalesRecord = {
			product_id: parseInt(productId),
			quantity,
			revenue: quantity * product.price,
			price_at_sale: product.price
		};

		// Save to database
		const success = await this.addSaleRecord(newSale);
		if (!success) {
			console.error("Failed to save sale to database");
			return { updatedProducts: products, updatedSales: salesHistory };
		}

		const updatedProducts = this.updateProductStock(
			products,
			productId,
			product.stock - quantity
		);

		// Return updated products and current sales history
		const updatedSales = await this.getSalesHistory();
		return { updatedProducts, updatedSales };
	}

	// Reset functionality
	static resetEconomy(products: Product[]): Product[] {
		return products.map((p) => ({ ...p, stock: p.initialStock }));
	}
}
