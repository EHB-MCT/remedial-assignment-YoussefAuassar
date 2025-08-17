/**
 * Analytics service for economic calculations and market analysis.
 * Handles all analytics computations for the economy simulation.
 */

import type { Product } from "../../database/products";
import type {
	SalesRecord,
	ProductStats,
	EconomicMetrics
} from "../../types/admin";

/**
 * Service class for economic analytics and market analysis.
 * Provides statistical calculations and market insights.
 */
export class AnalyticsService {
	/**
	 * Calculates comprehensive statistics for a specific product.
	 *
	 * @param {string} productId - The ID of the product to analyze.
	 * @param {SalesRecord[]} salesHistory - Complete sales transaction history.
	 * @returns {ProductStats} Statistical analysis including sales volume, revenue, and price history.
	 */
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

	/**
	 * Calculates comprehensive economic metrics for the entire marketplace.
	 *
	 * @param {SalesRecord[]} salesHistory - Complete sales transaction history.
	 * @param {Product[]} products - Array of all products in the system.
	 * @returns {EconomicMetrics} Overall economic indicators including revenue, volatility, and inflation.
	 */
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

		// Calculate market volatility
		const marketVolatility = this.calculateMarketVolatility(
			salesHistory,
			products
		);

		// Calculate price inflation
		const priceInflation = this.calculatePriceInflation(salesHistory);

		return {
			totalRevenue,
			totalTransactions,
			averageTransactionValue,
			marketVolatility,
			priceInflation
		};
	}

	/**
	 * Identifies and ranks the top-selling products by volume.
	 *
	 * @param {SalesRecord[]} salesHistory - Complete sales transaction history.
	 * @returns {ProductStats[]} Array of top 5 products ranked by total sales volume.
	 */
	static getTopProducts(salesHistory: SalesRecord[]): ProductStats[] {
		const productIds = [...new Set(salesHistory.map((sale) => sale.productId))];

		return productIds
			.map((id) => this.calculateProductStats(id, salesHistory))
			.sort((a, b) => b.totalSold - a.totalSold)
			.slice(0, 5);
	}

	/**
	 * Calculates market volatility based on price fluctuations.
	 * Uses standard deviation of price changes across all products.
	 *
	 * @param {SalesRecord[]} salesHistory - Complete sales transaction history.
	 * @param {Product[]} products - Array of all products in the system.
	 * @returns {number} Market volatility index (higher values indicate more instability).
	 */
	private static calculateMarketVolatility(
		salesHistory: SalesRecord[],
		products: Product[]
	): number {
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

		return (
			priceChanges.reduce((sum, vol) => sum + vol, 0) / priceChanges.length
		);
	}

	/**
	 * Calculates price inflation by comparing recent vs. historical prices.
	 *
	 * @param {SalesRecord[]} salesHistory - Complete sales transaction history.
	 * @returns {number} Price inflation percentage (positive = inflation, negative = deflation).
	 */
	private static calculatePriceInflation(salesHistory: SalesRecord[]): number {
		const recentSales = salesHistory.slice(-10); // Last 10 sales
		const oldSales = salesHistory.slice(0, 10); // First 10 sales

		if (recentSales.length === 0 || oldSales.length === 0) return 0;

		const recentAvgPrice =
			recentSales.reduce((sum, sale) => sum + sale.priceAtSale, 0) /
			recentSales.length;
		const oldAvgPrice =
			oldSales.reduce((sum, sale) => sum + sale.priceAtSale, 0) /
			oldSales.length;

		return oldAvgPrice > 0
			? ((recentAvgPrice - oldAvgPrice) / oldAvgPrice) * 100
			: 0;
	}

	/**
	 * Analyzes sales trends over a specified time period.
	 *
	 * @param {SalesRecord[]} salesHistory - Complete sales transaction history.
	 * @param {number} timeWindowHours - Time window for analysis in hours.
	 * @returns {Object} Sales trends data including hourly breakdown and totals.
	 */
	static getSalesTrends(
		salesHistory: SalesRecord[],
		timeWindowHours: number = 24
	): {
		hourly: { hour: number; sales: number; revenue: number }[];
		total: { sales: number; revenue: number };
	} {
		const now = Date.now();
		const timeWindow = timeWindowHours * 60 * 60 * 1000;

		const recentSales = salesHistory.filter(
			(sale) => now - sale.timestamp <= timeWindow
		);

		// Group by hour
		const hourlyData: { [hour: number]: { sales: number; revenue: number } } =
			{};

		recentSales.forEach((sale) => {
			const hour = Math.floor((now - sale.timestamp) / (60 * 60 * 1000));
			if (!hourlyData[hour]) {
				hourlyData[hour] = { sales: 0, revenue: 0 };
			}
			hourlyData[hour].sales += sale.quantity;
			hourlyData[hour].revenue += sale.revenue;
		});

		const hourly = Object.entries(hourlyData)
			.map(([hour, data]) => ({ hour: parseInt(hour), ...data }))
			.sort((a, b) => a.hour - b.hour);

		const total = recentSales.reduce(
			(acc, sale) => ({
				sales: acc.sales + sale.quantity,
				revenue: acc.revenue + sale.revenue
			}),
			{ sales: 0, revenue: 0 }
		);

		return { hourly, total };
	}
}
