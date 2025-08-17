import { useState, useEffect } from "react";
import { fetchProducts, type Product } from "../lib/supabase";
import type { CartItem } from "../types/cart";
import { addSaleRecord } from "../database/sales";
import type { DBSalesRecord } from "../types/admin";
import { AdminService } from "../services/adminService";

export function useShop() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	// Load products from database on component mount
	useEffect(() => {
		async function loadProducts() {
			try {
				setLoading(true);
				const dbProducts = await fetchProducts();

				// Use database products only
				if (dbProducts && dbProducts.length > 0) {
					console.log("✅ Using database products:", dbProducts);
					setProducts(dbProducts);
				} else {
					console.log("🔄 No products available from database");
					setProducts([]); // Empty array - no products available
				}
			} catch (error) {
				console.error("Error loading products:", error);
				// No products available if database fails
				setProducts([]);
			} finally {
				setLoading(false);
			}
		}

		loadProducts();
	}, []);
	const [balance, setBalance] = useState(50);
	const [cart, setCart] = useState<CartItem[]>([]);

	// Note: Removed localStorage sync since we're now using database persistence

	const currentPrice = (pid: number) =>
		products.find((p) => p.id === pid)?.price ?? 0;

	const addToCart = (pid: number) => {
		setProducts((prev) =>
			prev.map((p) =>
				p.id === pid && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p
			)
		);
		setCart((prev) => {
			const found = prev.find(
				(c) => c.productId === pid && c.priceAtAdd === currentPrice(pid)
			);
			return found
				? prev.map((c) => (c === found ? { ...c, qty: c.qty + 1 } : c))
				: [...prev, { productId: pid, qty: 1, priceAtAdd: currentPrice(pid) }];
		});
	};

	const removeFromCart = (pid: number, priceAtAdd: number) => {
		setCart((prev) => {
			const idx = prev.findIndex(
				(c) => c.productId === pid && c.priceAtAdd === priceAtAdd
			);
			if (idx === -1) return prev;
			const item = prev[idx];
			if (item.qty > 1)
				return prev.map((c, i) => (i === idx ? { ...c, qty: c.qty - 1 } : c));
			const copy = [...prev];
			copy.splice(idx, 1);
			return copy;
		});

		// Restore stock when removing from cart
		setProducts((prev) =>
			prev.map((p) => (p.id === pid ? { ...p, stock: p.stock + 1 } : p))
		);
	};

	const cartTotal = cart.reduce((acc, c) => acc + c.qty * c.priceAtAdd, 0);

	const checkout = async () => {
		if (cartTotal > balance) {
			alert("Onvoldoende saldo");
			return;
		}

		try {
			console.log("Starting checkout process...");
			console.log("Cart items:", cart);

			// Record sales for admin analytics - NOW USING DATABASE
			for (const item of cart) {
				const saleRecord: DBSalesRecord = {
					product_id: item.productId,
					quantity: item.qty,
					revenue: item.qty * item.priceAtAdd,
					price_at_sale: item.priceAtAdd
				};

				console.log("Saving sale record:", saleRecord);

				try {
					// Save to database instead of localStorage
					const success = await addSaleRecord(saleRecord);
					if (!success) {
						console.error("Failed to save sale record to database");
					} else {
						console.log("Sale record saved successfully to database");
					}
				} catch (dbError) {
					console.error("Database error when saving sale:", dbError);
					throw dbError; // Re-throw to trigger the catch block
				}
			}

			// Update product stock in database
			for (const item of cart) {
				try {
					console.log(`Updating stock for product ${item.productId}`);
					const success = await AdminService.updateProductStock(
						products,
						item.productId.toString(),
						(products.find((p) => p.id === item.productId)?.stock || 0) -
							item.qty
					);
					if (!success) {
						console.error(
							`Failed to update stock for product ${item.productId}`
						);
					}
				} catch (stockError) {
					console.error("Error updating product stock:", stockError);
				}
			}

			// 🚀 APPLY DYNAMIC PRICING AFTER PURCHASE
			console.log("🔄 Applying dynamic pricing after purchase...");
			try {
				const salesHistory = await AdminService.getSalesHistory();
				let updatedProducts = [...products];

				// Apply dynamic pricing to all purchased products
				for (const item of cart) {
					console.log(`🎯 Applying pricing to product ${item.productId}`);
					updatedProducts = await AdminService.applyDynamicPricing(
						item.productId.toString(),
						updatedProducts,
						salesHistory
					);
				}

				// Update the products state with new prices
				setProducts(updatedProducts);
				console.log("✅ Dynamic pricing applied successfully!");
			} catch (pricingError) {
				console.error("❌ Error applying dynamic pricing:", pricingError);
				// Don't fail checkout for pricing errors
			}

			// Refresh products from database to ensure data consistency
			try {
				const refreshedProducts = await fetchProducts();
				if (refreshedProducts && refreshedProducts.length > 0) {
					setProducts(refreshedProducts);
					console.log("🔄 Products refreshed from database");
				}
			} catch (refreshError) {
				console.error(
					"Failed to refresh products after checkout:",
					refreshError
				);
			}

			setBalance((b) => Number((b - cartTotal).toFixed(2)));
			setCart([]);
		} catch (error) {
			console.error("Checkout failed:", error);
			alert("Checkout failed. Please try again.");
		}
	};

	return {
		products,
		loading,
		balance,
		cart,
		cartTotal,
		addToCart,
		removeFromCart,
		checkout
	};
}
