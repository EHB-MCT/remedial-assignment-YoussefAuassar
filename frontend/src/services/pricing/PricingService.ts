/**
 * Service layer for dynamic pricing operations.
 * Uses Strategy Pattern for different pricing algorithms.
 */

import type { Product } from "../../database/products";
import type { SalesRecord } from "../../types/admin";
import type { PricingStrategy } from "./PricingStrategy";
import { updateProductPrice } from "../../database/products";
import { HybridPricing } from "./PricingStrategy";

/**
 * Pricing service that manages dynamic price calculations and updates.
 * Implements Strategy Pattern to allow switching between pricing algorithms.
 */
export class PricingService {
	private strategy: PricingStrategy;

	/**
	 * Creates a new PricingService instance.
	 *
	 * @param {PricingStrategy} strategy - The pricing strategy to use (defaults to HybridPricing).
	 */
	constructor(strategy: PricingStrategy = new HybridPricing()) {
		this.strategy = strategy;
	}

	/**
	 * Sets a different pricing strategy.
	 *
	 * @param {PricingStrategy} strategy - The new pricing strategy to use.
	 */
	setStrategy(strategy: PricingStrategy): void {
		this.strategy = strategy;
	}

	/**
	 * Calculates new price for a product using the current strategy.
	 *
	 * @param {Product} product - The product to price.
	 * @param {SalesRecord[]} salesHistory - Historical sales data.
	 * @param {number} [timeWindowHours] - Time window for analysis.
	 * @returns {number} The calculated price.
	 */
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours?: number
	): number {
		return this.strategy.calculatePrice(product, salesHistory, timeWindowHours);
	}

	/**
	 * Applies dynamic pricing to a single product and updates the database.
	 *
	 * @param {Product} product - The product to update.
	 * @param {SalesRecord[]} salesHistory - Historical sales data.
	 * @param {number} minPriceChange - Minimum price change required to update.
	 * @returns {Promise<number>} The final price (new or unchanged).
	 */
	async applyDynamicPricing(
		product: Product,
		salesHistory: SalesRecord[],
		minPriceChange: number = 0.01
	): Promise<number> {
		const newPrice = this.calculatePrice(product, salesHistory);
		const priceChange = Math.abs(newPrice - product.price);

		// Only update if price changed significantly
		if (priceChange >= minPriceChange) {
			console.log(
				`💰 Dynamic pricing: ${product.name} €${product.price.toFixed(
					2
				)} → €${newPrice.toFixed(2)}`
			);

			const success = await updateProductPrice(product.id, newPrice);
			if (!success) {
				console.error(`Failed to update price for ${product.name}`);
				return product.price; // Return original price if update failed
			}

			return newPrice;
		}

		return product.price; // No change
	}

	/**
	 * Applies dynamic pricing to multiple products in batch.
	 *
	 * @param {Product[]} products - Array of products to update.
	 * @param {SalesRecord[]} salesHistory - Historical sales data.
	 * @returns {Promise<Product[]>} Array of updated products with new prices.
	 */
	async applyDynamicPricingBatch(
		products: Product[],
		salesHistory: SalesRecord[]
	): Promise<Product[]> {
		const updatedProducts = [...products];

		for (let i = 0; i < updatedProducts.length; i++) {
			const product = updatedProducts[i];
			const newPrice = await this.applyDynamicPricing(product, salesHistory);
			updatedProducts[i] = { ...product, price: newPrice };
		}

		return updatedProducts;
	}

	/**
	 * Provides comprehensive pricing analysis for a product.
	 *
	 * @param {Product} product - The product to analyze.
	 * @param {SalesRecord[]} salesHistory - Historical sales data.
	 * @returns {Object} Detailed pricing analysis including suggested price and market conditions.
	 */
	getPricingAnalysis(
		product: Product,
		salesHistory: SalesRecord[]
	): {
		currentPrice: number;
		suggestedPrice: number;
		priceChange: number;
		priceChangePercent: number;
		demandLevel: "Low" | "Medium" | "High";
		stockLevel: "Low" | "Medium" | "High";
	} {
		const suggestedPrice = this.calculatePrice(product, salesHistory);
		const priceChange = suggestedPrice - product.price;
		const priceChangePercent = (priceChange / product.price) * 100;

		// Analyze demand based on recent sales
		const now = Date.now();
		const recentSales = salesHistory.filter(
			(sale) =>
				sale.productId === product.id.toString() &&
				now - sale.timestamp <= 24 * 60 * 60 * 1000 // 24 hours
		);
		const totalRecentSales = recentSales.reduce(
			(sum, sale) => sum + sale.quantity,
			0
		);

		let demandLevel: "Low" | "Medium" | "High";
		if (totalRecentSales >= 5) demandLevel = "High";
		else if (totalRecentSales >= 2) demandLevel = "Medium";
		else demandLevel = "Low";

		// Analyze stock level
		const stockRatio = product.stock / product.initialstock;
		let stockLevel: "Low" | "Medium" | "High";
		if (stockRatio <= 0.3) stockLevel = "Low";
		else if (stockRatio <= 0.7) stockLevel = "Medium";
		else stockLevel = "High";

		return {
			currentPrice: product.price,
			suggestedPrice,
			priceChange,
			priceChangePercent,
			demandLevel,
			stockLevel
		};
	}
}
