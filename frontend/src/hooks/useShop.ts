import { useState, useEffect } from "react";
import { fetchProducts, type Product } from "../lib/supabase";
import type { CartItem } from "../types/cart";

export function useShop() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	// Load products from database on component mount
	useEffect(() => {
		async function loadProducts() {
			try {
				setLoading(true);
				const dbProducts = await fetchProducts();

				// Prioritize database data, fallback to admin storage
				if (dbProducts && dbProducts.length > 0) {
					console.log("✅ Using database products:", dbProducts);
					setProducts(dbProducts);
				} else {
					const adminProducts = localStorage.getItem("adminProducts");
					if (adminProducts) {
						console.log("📱 Using localStorage products");
						setProducts(JSON.parse(adminProducts));
					} else {
						console.log("🔄 No fallback data available");
						setProducts([]); // Empty array - no fallback
					}
				}
			} catch (error) {
				console.error("Error loading products:", error);
				// No fallback data available if database fails
				setProducts([]);
			} finally {
				setLoading(false);
			}
		}

		loadProducts();
	}, []);
	const [balance, setBalance] = useState(50);
	const [cart, setCart] = useState<CartItem[]>([]);

	// Sync with admin changes
	useEffect(() => {
		const handleStorageChange = () => {
			const adminProducts = localStorage.getItem("adminProducts");
			if (adminProducts) {
				setProducts(JSON.parse(adminProducts));
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

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

	const checkout = () => {
		if (cartTotal > balance) {
			alert("Onvoldoende saldo");
			return;
		}

		// Record sales for admin analytics
		cart.forEach((item) => {
			const saleRecord = {
				productId: item.productId,
				quantity: item.qty,
				revenue: item.qty * item.priceAtAdd,
				timestamp: Date.now(),
				priceAtSale: item.priceAtAdd
			};

			// Add to existing sales history
			const existingSales = JSON.parse(
				localStorage.getItem("salesHistory") || "[]"
			);
			existingSales.push(saleRecord);
			localStorage.setItem("salesHistory", JSON.stringify(existingSales));

			// Update admin products storage
			const adminProducts = JSON.parse(
				localStorage.getItem("adminProducts") || "[]"
			);
			if (adminProducts.length > 0) {
				const updatedAdminProducts = adminProducts.map((p: Product) =>
					p.id === item.productId ? { ...p, stock: p.stock - item.qty } : p
				);
				localStorage.setItem(
					"adminProducts",
					JSON.stringify(updatedAdminProducts)
				);
			}
		});

		setBalance((b) => Number((b - cartTotal).toFixed(2)));
		setCart([]);
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
