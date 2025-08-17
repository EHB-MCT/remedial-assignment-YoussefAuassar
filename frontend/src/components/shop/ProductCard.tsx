/**
 * ProductCard component - Displays individual product with price, stock indicator, and add to cart button
 */
import { ShoppingCart } from "lucide-react";
import type { Product } from "../../database/products";
import { niceCurrency } from "../../utils/currency";

interface ProductCardProps {
	product: Product;
	onAddToCart: (productId: number) => void;
}

export default function ProductCard({
	product,
	onAddToCart
}: ProductCardProps) {
	const stockPercentage = product.initialstock
		? (product.stock / product.initialstock) * 100
		: 0;

	return (
		<div className="rounded-2xl bg-white shadow-sm p-4 border border-slate-200 flex flex-col">
			<div className="text-left">
				<div className="text-xl mb-2">
					{product.emoji} <span className="font-semibold">{product.name}</span>
				</div>
				<div className="text-2xl font-bold mb-2">
					{niceCurrency(product.price)}
				</div>
				<div className="mb-2 text-xs text-slate-500">Voorraad</div>
			</div>
			<div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
				<div
					className="h-full bg-slate-900"
					style={{ width: `${stockPercentage}%` }}
				/>
			</div>
			<div className="flex-1" />
			<button
				className="mt-2 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 text-white py-2 hover:opacity-90 disabled:bg-slate-300"
				onClick={() => onAddToCart(product.id)}
				disabled={product.stock <= 0}
			>
				<ShoppingCart className="w-4 h-4" />{" "}
				{product.stock > 0 ? "Koop" : "Uitverkocht"}
			</button>
		</div>
	);
}
