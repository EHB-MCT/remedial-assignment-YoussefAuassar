/**
 * Shop page - Main shopping interface with product grid and shopping cart
 */
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
		error,
		addToCart,
		removeFromCart,
		checkout,
		clearError
	} = useShop();

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
			{/* Error Banner */}
			{error && (
				<div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<span className="text-red-600 text-xl">⚠️</span>
							<div>
								<h3 className="text-sm font-medium text-red-800">Fout</h3>
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
						<button
							onClick={clearError}
							className="text-red-400 hover:text-red-600 text-xl font-bold"
						>
							×
						</button>
					</div>
				</div>
			)}

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
