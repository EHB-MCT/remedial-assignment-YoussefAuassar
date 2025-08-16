import React from "react";
import type { Product } from "../../database/products";
import type { ProductStats } from "../../types/admin";

interface SalesAnalyticsProps {
	selectedProduct: string;
	products: Product[];
	getProductStats: (productId: string) => ProductStats;
}

export default function SalesAnalytics({
	selectedProduct,
	products,
	getProductStats
}: SalesAnalyticsProps) {
	// Get the selected product details
	const product = products.find((p) => p.id === parseInt(selectedProduct));

	// Get sales statistics for the selected product
	const stats = selectedProduct ? getProductStats(selectedProduct) : null;

	// Debug logging
	console.log("SalesAnalytics Debug:", { selectedProduct, product, stats });

	if (!selectedProduct) {
		return (
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
				<h2 className="text-xl font-semibold text-slate-900 mb-4">
					Sales Analytics
				</h2>
				<div className="text-center text-slate-500 py-8">
					Select a product to view its sales analytics
				</div>
			</div>
		);
	}

	if (!product || !stats) {
		return (
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
				<h2 className="text-xl font-semibold text-slate-900 mb-4">
					Sales Analytics
				</h2>
				<div className="text-center text-red-500 py-8">
					Error loading product statistics
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
			{/* Simple header */}
			<div className="flex items-center gap-3 mb-6">
				<span className="text-3xl">{product.emoji}</span>
				<h2 className="text-xl font-semibold text-slate-900">
					{product.name} Analytics
				</h2>
			</div>

			{/* Just the 3 basic stat cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-slate-50 rounded-xl p-4 text-center">
					<div className="text-sm text-slate-600 mb-1">Total Sales</div>
					<div className="text-2xl font-bold text-slate-900">
						{stats.totalSold}
					</div>
				</div>

				<div className="bg-emerald-50 rounded-xl p-4 text-center">
					<div className="text-sm text-slate-600 mb-1">Total Revenue</div>
					<div className="text-2xl font-bold text-emerald-600">
						€{stats.totalRevenue.toFixed(2)}
					</div>
				</div>

				<div className="bg-purple-50 rounded-xl p-4 text-center">
					<div className="text-sm text-slate-600 mb-1">Average Price</div>
					<div className="text-2xl font-bold text-purple-600">
						€{stats.averagePrice.toFixed(2)}
					</div>
				</div>
			</div>
		</div>
	);
}
