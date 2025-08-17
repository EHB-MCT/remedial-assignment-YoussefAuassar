import EconomicOverview from "../components/admin/EconomicOverview";
import ProductManagement from "../components/admin/ProductManagement";
import Leaderboard from "../components/admin/Leaderboard";
import SalesAnalytics from "../components/admin/SalesAnalytics";
import ProductSelector from "../components/admin/ProductSelector";
import { useAdmin } from "../hooks/useAdmin";
import { ADMIN_CONSTANTS } from "../constants/storage";

export default function Admin() {
	console.log("Admin component rendering..."); // Debug log

	try {
		const {
			products,
			selectedProduct,
			economicMetrics,
			isLoading,
			error,
			setSelectedProduct,
			updateProductPrice,
			updateProductStock,
			resetEconomy,
			getProductStats,
			getTopProducts,
			clearError
		} = useAdmin();

		console.log("Admin hook data:", { products, isLoading, error }); // Debug log

		if (isLoading) {
			console.log("Showing loading state..."); // Debug log
			return (
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto mb-4"></div>
						<p className="text-lg text-slate-600">Loading economic data...</p>
					</div>
				</div>
			);
		}

		console.log("Rendering admin content..."); // Debug log

		return (
			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Header section */}
				<div className="mb-6 text-center">
					<h1 className="text-3xl font-bold text-slate-900 mb-3">
						Admin Dashboard
					</h1>
					<p className="text-lg text-slate-600">
						Houd je festival drink empire in de gaten en boost je verkoop!
					</p>
				</div>

				{/* Error Banner */}
				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<span className="text-red-600 text-xl">⚠️</span>
								<div>
									<h3 className="text-sm font-medium text-red-800">Error</h3>
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

				{/* Economic Overview */}
				<EconomicOverview metrics={economicMetrics} />

				{/* Main content grid */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
					{/* Left: Product Management */}
					<div className="xl:col-span-2">
						<ProductManagement
							products={products}
							onUpdatePrice={updateProductPrice}
							onUpdateStock={updateProductStock}
							onResetEconomy={resetEconomy}
						/>
					</div>

					{/* Right: Leaderboard */}
					<div>
						<Leaderboard topProducts={getTopProducts()} products={products} />
					</div>
				</div>

				{/* Sales Analytics */}
				<SalesAnalytics
					selectedProduct={selectedProduct}
					products={products}
					getProductStats={getProductStats}
				/>

				{/* Product Selector */}
				<ProductSelector
					products={products}
					selectedProduct={selectedProduct}
					onProductSelect={setSelectedProduct}
				/>

				{/* Footer with validation info */}
				<div className="mt-8 text-center text-sm text-slate-500">
					<p>
						Price range: €{ADMIN_CONSTANTS.MIN_PRICE} - €
						{ADMIN_CONSTANTS.MAX_PRICE} | Stock range:{" "}
						{ADMIN_CONSTANTS.MIN_STOCK} - {ADMIN_CONSTANTS.MAX_STOCK}
					</p>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Error in Admin component:", error);
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Error Loading Admin
					</h1>
					<p className="text-red-500">
						Something went wrong. Please check the console for details.
					</p>
					<pre className="mt-4 text-xs text-red-400 bg-red-50 p-4 rounded">
						{error instanceof Error ? error.message : String(error)}
					</pre>
				</div>
			</div>
		);
	}
}
