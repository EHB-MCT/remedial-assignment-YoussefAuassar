import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import type { Product } from "../database/products";
import { niceCurrency } from "../utils/currency";
import CartRow from "./CartRow";

import type { CartItem } from "../types/cart";

interface ShoppingCartProps {
	cart: CartItem[];
	products: Product[];
	cartTotal: number;
	removeFromCart: (productId: string, priceAtAdd: number) => void;
	onCheckout: () => void;
}

export default function ShoppingCart({
	cart,
	products,
	cartTotal,
	removeFromCart,
	onCheckout
}: ShoppingCartProps) {
	return (
		<div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 self-start">
			<div className="flex items-center gap-2 font-semibold mb-2">
				<ShoppingCartIcon className="w-4 h-4" /> Mandje
			</div>
			<div className="divide-y">
				{cart.length === 0 && (
					<div className="text-sm text-slate-500 text-left">
						Je mandje is leeg.
					</div>
				)}
				{cart.map((item, idx) => (
					<CartRow
						key={`${item.productId}-${idx}`}
						item={item}
						products={products}
						removeFromCart={removeFromCart}
					/>
				))}
			</div>
			<div className="mt-3 flex items-center justify-between text-sm">
				<span className="text-slate-500">Totaal</span>
				<span className="font-semibold">{niceCurrency(cartTotal)}</span>
			</div>
			<button
				className="mt-3 w-full rounded-xl bg-emerald-600 text-white py-2 hover:opacity-90 disabled:bg-slate-300"
				disabled={cartTotal === 0}
				onClick={onCheckout}
			>
				Afrekenen
			</button>
		</div>
	);
}
