/**
 * Service Layer for Pricing Operations
 * Follows Single Responsibility Principle
 * Uses Strategy Pattern for different pricing algorithms
 */

import type { Product } from "../../database/products";
import type { SalesRecord } from "../../types/admin";
import { updateProductPrice } from "../../database/products";
import { PricingStrategy, HybridPricing } from "./PricingStrategy";

export class PricingService {
	private strategy: PricingStrategy;

	constructor(strategy: PricingStrategy = new HybridPricing()) {
		this.strategy = strategy;
	}

	/**
	 * Set a different pricing strategy
	 */
	setStrategy(strategy: PricingStrategy): void {
		this.strategy = strategy;
	}

	/**
	 * Calculate new price for a product using current strategy
	 */
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours?: number
	): number {
		return this.strategy.calculatePrice(product, salesHistory, timeWindowHours);
	}

	/**
	 * Apply dynamic pricing to a single product
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
	 * Apply dynamic pricing to multiple products
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
	 * Get pricing analysis for a product
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
