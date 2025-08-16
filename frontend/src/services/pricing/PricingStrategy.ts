/**
 * Strategy Pattern for Different Pricing Algorithms
 * Follows SOLID principles - Open/Closed and Single Responsibility
 */

import type { Product } from "../../database/products";
import type { SalesRecord } from "../../types/admin";

export interface PricingStrategy {
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours?: number
	): number;
}

/**
 * Demand-based pricing strategy
 * Adjusts prices based on recent sales volume
 */
export class DemandBasedPricing implements PricingStrategy {
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

	private calculateDemandFactor(recentSales: number): number {
		if (recentSales >= 10) return 1.3; // High demand
		if (recentSales >= 5) return 1.15;
		if (recentSales >= 2) return 1.0;
		if (recentSales >= 1) return 0.95;
		return 0.8; // Low demand
	}
}

/**
 * Supply-based pricing strategy
 * Adjusts prices based on stock levels
 */
export class SupplyBasedPricing implements PricingStrategy {
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
 * Combined pricing strategy
 * Uses both demand and supply factors
 */
export class HybridPricing implements PricingStrategy {
	private demandStrategy = new DemandBasedPricing();
	private supplyStrategy = new SupplyBasedPricing();

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
