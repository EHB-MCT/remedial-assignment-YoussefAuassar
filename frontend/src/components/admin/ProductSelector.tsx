import React from "react";
import type { Product } from "../../database/products";

/**
 * Props for the ProductSelector component
 */
interface ProductSelectorProps {
	/** Array of available products to select from */
	products: Product[];
	/** Currently selected product ID */
	selectedProduct: string;
	/** Callback function when a product is selected/deselected */
	onProductSelect: (productId: string) => void;
}

/**
 * ProductSelector component allows users to select a product for analytics
 * Shows a grid of product buttons with emoji and name
 * Supports toggle selection (click to select, click again to deselect)
 */
export default function ProductSelector({
	products,
	selectedProduct,
	onProductSelect
}: ProductSelectorProps) {
	return (
		<div className="mt-6 rounded-2xl bg-white shadow-sm p-4 border border-slate-200">
			{/* Component header */}
			<h2 className="text-xl font-semibold text-slate-900 mb-4">
				View Product Analytics
			</h2>

			{/* Product selection grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{products.map((product) => (
					<button
						key={product.id}
						onClick={() =>
							onProductSelect(selectedProduct === product.id ? "" : product.id)
						}
						className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
							selectedProduct === product.id
								? "border-slate-900 bg-slate-900 text-white"
								: "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
						}`}
					>
						{/* Product button content */}
						<div className="text-center">
							<div className="text-2xl mb-1">{product.emoji}</div>
							<div className="text-xs font-medium truncate">{product.name}</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
