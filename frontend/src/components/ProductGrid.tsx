import type { Product } from "../database/products";
import { niceCurrency } from "../utils/currency";
import ProductCard from "./ProductCard";

interface ProductGridProps {
	products: Product[];
	balance: number;
	onAddToCart: (productId: string) => void;
}

export default function ProductGrid({
	products,
	balance,
	onAddToCart
}: ProductGridProps) {
	return (
		<div className="lg:col-span-2">
			<div className="mb-3 text-sm text-slate-600">
				Saldo:{" "}
				<span className="font-semibold text-slate-900">
					{niceCurrency(balance)}
				</span>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onAddToCart={onAddToCart}
					/>
				))}
			</div>
		</div>
	);
}
