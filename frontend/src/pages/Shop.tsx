import ProductGrid from "../components/shop/ProductGrid";
import ShoppingCart from "../components/shop/ShoppingCart";
import { useShop } from "../hooks/useShop";

export default function Shop() {
	const {
		products,
		loading,
		balance,
		cart,
		cartTotal,
		addToCart,
		removeFromCart,
		checkout
	} = useShop();

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
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
				{loading ? (
					<div className="lg:col-span-2 flex items-center justify-center">
						<div className="text-lg text-slate-600">Loading products...</div>
					</div>
				) : (
					<ProductGrid products={products} onAddToCart={addToCart} />
				)}

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
