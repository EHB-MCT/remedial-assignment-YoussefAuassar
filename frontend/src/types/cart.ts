/**
 * Type definitions for shopping cart functionality.
 */

/**
 * Represents an item in the shopping cart.
 *
 * @typedef {Object} CartItem
 * @property {number} productId - ID of the product (matches Product.id).
 * @property {number} qty - Quantity of this product in the cart.
 * @property {number} priceAtAdd - Price when the item was added to cart (for price tracking).
 */
export interface CartItem {
	productId: number; // Changed from string to number to match Product.id
	qty: number;
	priceAtAdd: number;
}
