import { useState, useEffect, useCallback } from "react";
import type { Product } from "../lib/supabase";
import type { SalesRecord, EconomicMetrics } from "../types/admin";
import { AdminService } from "../services/adminService";
import { fetchProducts } from "../lib/supabase";
import { ADMIN_CONSTANTS } from "../constants/storage";

export function useAdmin() {
	const [products, setProducts] = useState<Product[]>([]);
	const [salesHistory, setSalesHistory] = useState<SalesRecord[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [economicMetrics, setEconomicMetrics] = useState<EconomicMetrics>({
		totalRevenue: 0,
		totalTransactions: 0,
		averageTransactionValue: 0,
		marketVolatility: 0,
		priceInflation: 0
	});

	// Load data from storage on mount
	useEffect(() => {
		loadDataFromStorage();
	}, []);

	// Listen for storage changes to update in real-time
	useEffect(() => {
		const handleStorageChange = () => {
			loadDataFromStorage();
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	// Update economic metrics when data changes
	useEffect(() => {
		const metrics = AdminService.calculateEconomicMetrics(
			salesHistory,
			products
		);
		setEconomicMetrics(metrics);
	}, [salesHistory, products]);

	const loadDataFromStorage = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Try to load from database first
			let dbProducts: Product[] = [];
			try {
				dbProducts = await fetchProducts();
			} catch (dbError) {
				console.warn(
					"Database connection failed, using local storage:",
					dbError
				);
			}

			const storedProducts = AdminService.getProducts();
			let storedSales: SalesRecord[] = [];
			try {
				console.log("🔄 Attempting to load sales history...");
				storedSales = await AdminService.getSalesHistory();
				console.log("📊 Sales history loaded:", storedSales);
				console.log("📊 Sales count:", storedSales.length);
			} catch (dbError) {
				console.warn("❌ Failed to load sales from database:", dbError);
			}

			// Use database products if available, otherwise fallback to stored
			if (dbProducts.length > 0) {
				setProducts(dbProducts);
			} else if (storedProducts.length > 0) {
				setProducts(storedProducts);
			} else {
				// No fallback data available
				setProducts([]);
			}

			if (storedSales.length > 0) {
				setSalesHistory(storedSales);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to load data";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Validation functions
	const validatePrice = useCallback((price: number): boolean => {
		return (
			price >= ADMIN_CONSTANTS.MIN_PRICE && price <= ADMIN_CONSTANTS.MAX_PRICE
		);
	}, []);

	const validateStock = useCallback((stock: number): boolean => {
		return (
			stock >= ADMIN_CONSTANTS.MIN_STOCK && stock <= ADMIN_CONSTANTS.MAX_STOCK
		);
	}, []);

	const updateProductPrice = useCallback(
		async (productId: string, newPrice: number) => {
			if (!validatePrice(newPrice)) {
				const errorMessage = `Price must be between €${ADMIN_CONSTANTS.MIN_PRICE} and €${ADMIN_CONSTANTS.MAX_PRICE}`;
				setError(errorMessage);
				return;
			}

			setError(null);
			try {
				const updatedProducts = await AdminService.updateProductPrice(
					products,
					productId,
					newPrice
				);
				setProducts(updatedProducts);
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to update product price";
				setError(errorMessage);
			}
		},
		[validatePrice, products]
	);

	const updateProductStock = useCallback(
		async (productId: string, newStock: number) => {
			if (!validateStock(newStock)) {
				const errorMessage = `Stock must be between ${ADMIN_CONSTANTS.MIN_STOCK} and ${ADMIN_CONSTANTS.MAX_STOCK}`;
				setError(errorMessage);
				return;
			}

			setError(null);
			try {
				const updatedProducts = await AdminService.updateProductStock(
					products,
					productId,
					newStock
				);
				setProducts(updatedProducts);
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to update product stock";
				setError(errorMessage);
			}
		},
		[validateStock, products]
	);

	const simulatePurchase = useCallback(
		async (productId: string) => {
			try {
				setError(null);
				const { updatedProducts, updatedSales } =
					await AdminService.simulatePurchase(
						productId,
						products,
						salesHistory
					);

				setProducts(updatedProducts);
				setSalesHistory(updatedSales);
				AdminService.saveProducts(updatedProducts);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to simulate purchase";
				setError(errorMessage);
			}
		},
		[products, salesHistory]
	);

	const resetEconomy = useCallback(() => {
		if (
			confirm(
				"⚠️ Are you sure you want to reset the entire economy?\n\nThis will:\n• Clear all sales data\n• Reset all product stocks\n• Cannot be undone\n\nType 'RESET' to confirm:"
			)
		) {
			try {
				setError(null);
				setSalesHistory([]);
				setProducts((prevProducts) => {
					const resetProducts = AdminService.resetEconomy(prevProducts);
					AdminService.saveProducts(resetProducts);
					AdminService.saveSalesHistory([]);
					return resetProducts;
				});
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to reset economy";
				setError(errorMessage);
			}
		}
	}, []);

	const getProductStats = useCallback(
		(productId: string) => {
			console.log("🔍 getProductStats called with:", productId);
			console.log("🔍 Available sales history:", salesHistory);
			const stats = AdminService.calculateProductStats(productId, salesHistory);
			console.log("🔍 Calculated stats:", stats);
			return stats;
		},
		[salesHistory]
	);

	const getTopProducts = useCallback(() => {
		console.log("getTopProducts Debug:", {
			salesHistory,
			length: salesHistory.length
		});
		const topProducts = AdminService.getTopProducts(salesHistory);
		console.log("getTopProducts Result:", topProducts);
		return topProducts;
	}, [salesHistory]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		// State
		products,
		salesHistory,
		selectedProduct,
		economicMetrics,
		isLoading,
		error,

		// Actions
		setSelectedProduct,
		updateProductPrice,
		updateProductStock,
		simulatePurchase,
		resetEconomy,
		clearError,

		// Computed values
		getProductStats,
		getTopProducts,

		// Validation
		validatePrice,
		validateStock
	};
}
