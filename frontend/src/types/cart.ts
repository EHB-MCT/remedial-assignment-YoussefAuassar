export interface CartItem {
	productId: number; // Changed from string to number to match Product.id
	qty: number;
	priceAtAdd: number;
}
