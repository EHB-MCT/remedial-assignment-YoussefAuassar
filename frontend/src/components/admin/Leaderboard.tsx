import type { Product } from "../../database/products";

interface LeaderboardProps {
	topProducts: Array<{
		productId: string;
		totalSold: number;
		totalRevenue: number;
	}>;
	products: Product[];
}

export default function Leaderboard({
	topProducts,
	products
}: LeaderboardProps) {
	// Debug logging
	console.log("Leaderboard Debug:", { topProducts, products });

	// Get the top 5 products by sales
	const top5Products = topProducts.slice(0, 5);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
			{/* Header */}
			<h2 className="text-xl font-semibold text-slate-900 mb-4">
				Top Selling Products
			</h2>

			{/* Leaderboard list */}
			<div className="space-y-3">
				{top5Products.length === 0 ? (
					<div className="text-center text-slate-500 py-8">
						No sales data yet
					</div>
				) : (
					top5Products.map((topProduct, index) => {
						// Find the product details
						console.log("🔍 Matching product:", {
							topProduct,
							searchingFor: topProduct.productId
						});
						const product = products.find((p) => {
							console.log(
								"🔍 Comparing:",
								p.id,
								"vs",
								topProduct.productId,
								"match:",
								p.id === parseInt(topProduct.productId)
							);
							return p.id === parseInt(topProduct.productId);
						});
						console.log("🔍 Found product:", product);
						if (!product) return null;

						return (
							<div
								key={topProduct.productId}
								className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
									index === 0
										? "bg-yellow-50 border border-yellow-200"
										: index === 1
										? "bg-slate-50 border border-slate-200"
										: index === 2
										? "bg-orange-50 border border-orange-200"
										: "bg-slate-50 border border-slate-200"
								}`}
							>
								{/* Rank indicator */}
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
										index === 0
											? "bg-yellow-500 text-white"
											: index === 1
											? "bg-slate-500 text-white"
											: index === 2
											? "bg-orange-500 text-white"
											: "bg-slate-300 text-slate-700"
									}`}
								>
									{index + 1}
								</div>

								{/* Product info */}
								<div className="flex items-center gap-3 flex-1">
									<span className="text-2xl">{product.emoji}</span>
									<div className="flex-1">
										<div className="font-medium text-slate-900">
											{product.name}
										</div>
										<div className="text-sm text-slate-500">
											{topProduct.totalSold} sold
										</div>
									</div>
								</div>

								{/* Revenue display */}
								<div className="text-right">
									<div className="font-semibold text-slate-900">
										€{topProduct.totalRevenue.toFixed(2)}
									</div>
									<div className="text-xs text-slate-500">Revenue</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
