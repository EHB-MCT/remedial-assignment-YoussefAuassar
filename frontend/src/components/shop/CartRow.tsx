import type { Product } from "../../database/products";
import { niceCurrency } from "../../utils/currency";

import type { CartItem } from "../../types/cart";

/**
 * Props for the CartRow component
 */
interface CartRowProps {
	/** The cart item to display */
	item: CartItem;
	/** Array of all available products for lookup */
	products: Product[];
	/** Function to remove an item from the cart */
	removeFromCart: (productId: string, priceAtAdd: number) => void;
}

/**
 * CartRow component displays a single item in the shopping cart
 * Shows product emoji, name, quantity, price, and remove button
 */
export default function CartRow({
	item,
	products,
	removeFromCart
}: CartRowProps) {
	// Find the product details based on the cart item's product ID
	const product = products.find((p) => p.id === item.productId);

	if (!product) return null;

	return (
		<div className="py-2 flex items-center gap-3">
			<div className="text-xl">{product.emoji}</div>

			<div className="flex-1">
				<div className="text-sm font-medium">{product.name}</div>

				<div className="text-xs text-slate-500">
					{item.qty} × {niceCurrency(item.priceAtAdd)}
				</div>
			</div>

			{/* Total price for this item (quantity × price) */}
			<div className="text-sm font-semibold">
				{niceCurrency(item.qty * item.priceAtAdd)}
			</div>

			{/* Remove button with accessibility label */}
			<button
				className="ml-2 text-slate-500 hover:text-red-600"
				onClick={() => removeFromCart(item.productId, item.priceAtAdd)}
				aria-label="Verwijder uit mandje"
			>
				×
			</button>
		</div>
	);
}
