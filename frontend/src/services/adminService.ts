import type { Product } from "../database/products";
import type {
	SalesRecord,
	ProductStats,
	EconomicMetrics
} from "../types/admin";
import { STORAGE_KEYS, DEFAULT_QUANTITY_RANGE } from "../constants/storage";

export class AdminService {
	// Product Management
	static getProducts(): Product[] {
		const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PRODUCTS);
		return stored ? JSON.parse(stored) : [];
	}

	static saveProducts(products: Product[]): void {
		localStorage.setItem(STORAGE_KEYS.ADMIN_PRODUCTS, JSON.stringify(products));
	}

	static updateProductPrice(
		products: Product[],
		productId: string,
		newPrice: number
	): Product[] {
		return products.map((product) =>
			product.id === productId ? { ...product, price: newPrice } : product
		);
	}

	static updateProductStock(
		products: Product[],
		productId: string,
		newStock: number
	): Product[] {
		return products.map((product) =>
			product.id === productId ? { ...product, stock: newStock } : product
		);
	}

	// Sales Management
	static getSalesHistory(): SalesRecord[] {
		const stored = localStorage.getItem(STORAGE_KEYS.SALES_HISTORY);
		return stored ? JSON.parse(stored) : [];
	}

	static saveSalesHistory(sales: SalesRecord[]): void {
		localStorage.setItem(STORAGE_KEYS.SALES_HISTORY, JSON.stringify(sales));
	}

	static addSaleRecord(
		sales: SalesRecord[],
		newSale: SalesRecord
	): SalesRecord[] {
		return [...sales, newSale];
	}

	// Analytics
	static calculateProductStats(
		productId: string,
		salesHistory: SalesRecord[]
	): ProductStats {
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
				(sale) => sale.productId === product.id
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

	// Economy Simulation
	static simulatePurchase(
		productId: string,
		products: Product[],
		salesHistory: SalesRecord[]
	): {
		updatedProducts: Product[];
		updatedSales: SalesRecord[];
	} {
		const product = products.find((p) => p.id === productId);
		if (!product || product.stock <= 0) {
			return { updatedProducts: products, updatedSales: salesHistory };
		}

		const quantity =
			Math.floor(
				Math.random() *
					(DEFAULT_QUANTITY_RANGE.max - DEFAULT_QUANTITY_RANGE.min + 1)
			) + DEFAULT_QUANTITY_RANGE.min;
		const newSale: SalesRecord = {
			productId,
			quantity,
			revenue: quantity * product.price,
			timestamp: Date.now(),
			priceAtSale: product.price
		};

		const updatedProducts = this.updateProductStock(
			products,
			productId,
			product.stock - quantity
		);
		const updatedSales = this.addSaleRecord(salesHistory, newSale);

		return { updatedProducts, updatedSales };
	}

	// Reset functionality
	static resetEconomy(products: Product[]): Product[] {
		return products.map((p) => ({ ...p, stock: p.initialStock }));
	}
}
