import ProductCard from "../components/ProductCard";
import ShoppingCart from "../components/ShoppingCart";
import { useShop } from "../hooks/useShop";

export default function Shop() {
	const {
		products,
		balance,
		cart,
		cartTotal,
		addToCart,
		removeFromCart,
		checkout
	} = useShop();

	return (
		<div>
			{/* Saldo at the top spanning full width */}
			<div className="mb-6 text-sm text-slate-600 text-left">
				Saldo:{" "}
				<span className="font-semibold text-slate-900">
					€{balance.toFixed(2)}
				</span>
			</div>

			{/* Products and cart side by side */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: product grid */}
				<div className="lg:col-span-2">
					<div className="grid grid-cols-2 gap-4">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onAddToCart={addToCart}
							/>
						))}
					</div>
				</div>

				{/* Right: shopping cart at same level as products */}
				<ShoppingCart
					cart={cart}
					products={products}
					cartTotal={cartTotal}
					removeFromCart={removeFromCart}
					onCheckout={checkout}
				/>
			</div>
		</div>
	);
}
