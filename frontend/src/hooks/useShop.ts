import { useState, useEffect } from "react";
import { initialProducts } from "../database/products";
import type { Product } from "../database/products";
import type { CartItem } from "../types/cart";

export function useShop() {
	const [products, setProducts] = useState<Product[]>(() => {
		// Try to load from admin storage first, fallback to initial products
		const adminProducts = localStorage.getItem("adminProducts");
		if (adminProducts) {
			return JSON.parse(adminProducts);
		}
		return initialProducts;
	});
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

	const currentPrice = (pid: string) =>
		products.find((p) => p.id === pid)?.price ?? 0;

	const addToCart = (pid: string) => {
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

	const removeFromCart = (pid: string, priceAtAdd: number) => {
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
		balance,
		cart,
		cartTotal,
		addToCart,
		removeFromCart,
		checkout
	};
}
