import type { Product } from "../../database/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
	products: Product[];
	onAddToCart: (productId: number) => void;
}

export default function ProductGrid({
	products,
	onAddToCart
}: ProductGridProps) {
	return (
		<div className="lg:col-span-2">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
