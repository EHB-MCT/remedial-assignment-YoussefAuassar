/**
 * Dynamic pricing strategy implementations for the economy simulation.
 * Uses Strategy Pattern for different pricing algorithms.
 */

import type { Product } from "../../database/products";
import type { SalesRecord } from "../../types/admin";

/**
 * Strategy interface for pricing algorithms.
 * Defines the contract that all pricing strategies must implement.
 *
 * @interface PricingStrategy
 */
export interface PricingStrategy {
	/**
	 * Calculates the optimal price for a product based on the strategy's algorithm.
	 *
	 * @param {Product} product - The product to price.
	 * @param {SalesRecord[]} salesHistory - Historical sales data for analysis.
	 * @param {number} [timeWindowHours=24] - Time window for recent sales analysis.
	 * @returns {number} The calculated optimal price in euros.
	 */
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours?: number
	): number;
}

/**
 * Demand-based pricing strategy.
 * Adjusts prices based on recent sales volume (demand signals).
 * Higher demand leads to higher prices.
 */
export class DemandBasedPricing implements PricingStrategy {
	/**
	 * Calculates price based on recent sales demand.
	 * Analyzes sales volume within a time window and applies demand multipliers.
	 *
	 * @param {Product} product - Target product for pricing.
	 * @param {SalesRecord[]} salesHistory - Complete sales history.
	 * @param {number} timeWindowHours - Hours to look back for recent sales.
	 * @returns {number} New price based on demand analysis.
	 */
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours: number = 24
	): number {
		const now = Date.now();
		const timeWindow = timeWindowHours * 60 * 60 * 1000;

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

		// Calculate demand factor
		const demandFactor = this.calculateDemandFactor(totalRecentSales);

		// Apply bounds
		const newPrice = basePrice * demandFactor;
		const minPrice = basePrice * 0.7;
		const maxPrice = basePrice * 1.5;

		return Math.max(minPrice, Math.min(maxPrice, newPrice));
	}

	/**
	 * Calculates the demand multiplier based on sales volume.
	 * Uses step function to prevent extreme price volatility.
	 *
	 * @param {number} recentSales - Total quantity sold recently.
	 * @returns {number} Multiplier factor (0.8 to 1.3).
	 */
	private calculateDemandFactor(recentSales: number): number {
		if (recentSales >= 10) return 1.3; // High demand: +30%
		if (recentSales >= 5) return 1.15; // Moderate: +15%
		if (recentSales >= 2) return 1.0; // Normal: no change
		if (recentSales >= 1) return 0.95; // Low: -5%
		return 0.8; // Very low demand: -20%
	}
}

/**
 * Supply-based pricing strategy.
 * Adjusts prices based on stock levels (supply scarcity).
 * Lower stock leads to higher prices.
 */
export class SupplyBasedPricing implements PricingStrategy {
	/**
	 * Calculates price based on current stock levels.
	 * Uses stock ratio to determine scarcity premium.
	 *
	 * @param {Product} product - Target product for pricing.
	 * @returns {number} New price based on supply analysis.
	 */
	calculatePrice(product: Product): number {
		const stockRatio = product.stock / product.initialstock;
		const basePrice = product.price;

		// Low stock = higher price (scarcity)
		let stockFactor = 1.0;
		if (stockRatio <= 0.1) stockFactor = 1.2;
		else if (stockRatio <= 0.3) stockFactor = 1.1;
		else if (stockRatio >= 0.8) stockFactor = 0.95;

		const newPrice = basePrice * stockFactor;
		const minPrice = basePrice * 0.8;
		const maxPrice = basePrice * 1.4;

		return Math.max(minPrice, Math.min(maxPrice, newPrice));
	}
}

/**
 * Hybrid pricing strategy.
 * Combines both demand and supply factors for comprehensive pricing.
 * Uses weighted average: 60% demand, 40% supply.
 */
export class HybridPricing implements PricingStrategy {
	private demandStrategy = new DemandBasedPricing();
	private supplyStrategy = new SupplyBasedPricing();

	/**
	 * Calculates price using combined demand and supply analysis.
	 * Balances market responsiveness with inventory management.
	 *
	 * @param {Product} product - Target product for pricing.
	 * @param {SalesRecord[]} salesHistory - Complete sales history for demand analysis.
	 * @param {number} timeWindowHours - Time window for demand calculation.
	 * @returns {number} New price based on hybrid analysis.
	 */
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours: number = 24
	): number {
		const demandPrice = this.demandStrategy.calculatePrice(
			product,
			salesHistory,
			timeWindowHours
		);
		const supplyPrice = this.supplyStrategy.calculatePrice(product);

		// Weight the strategies (60% demand, 40% supply)
		const hybridPrice = demandPrice * 0.6 + supplyPrice * 0.4;

		const basePrice = product.price;
		const minPrice = basePrice * 0.5;
		const maxPrice = basePrice * 2.0;

		return Math.max(minPrice, Math.min(maxPrice, hybridPrice));
	}
}
