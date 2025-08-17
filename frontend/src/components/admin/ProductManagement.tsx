import { useState } from "react";
import type { Product } from "../../database/products";
import { ADMIN_CONSTANTS } from "../../constants/storage";

interface ProductManagementProps {
	products: Product[];
	onUpdatePrice: (productId: string, newPrice: number) => void;
	onUpdateStock: (productId: string, newStock: number) => void;
}

export default function ProductManagement({
	products,
	onUpdatePrice,
	onUpdateStock
}: ProductManagementProps) {
	// Track which product is currently being edited
	const [editingProduct, setEditingProduct] = useState<number | null>(null);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
			{/* Header with title */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-slate-900">
					Product Management
				</h2>
			</div>

			{/* Product table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-slate-200">
							<th className="text-left py-3 px-4 font-medium text-slate-700">
								Product
							</th>
							<th className="text-left py-3 px-4 font-medium text-slate-700">
								Price
							</th>
							<th className="text-left py-3 px-4 font-medium text-slate-700">
								Stock
							</th>
							<th className="text-left py-3 px-4 font-medium text-slate-700">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{/* Render each product row */}
						{products.map((product) => (
							<ProductRow
								key={product.id}
								product={product}
								isEditing={editingProduct === product.id}
								onEditStart={() => setEditingProduct(product.id)}
								onEditCancel={() => setEditingProduct(null)}
								onUpdatePrice={onUpdatePrice}
								onUpdateStock={onUpdateStock}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// ProductRow component for individual product rows
interface ProductRowProps {
	product: Product;
	isEditing: boolean;
	onEditStart: () => void;
	onEditCancel: () => void;
	onUpdatePrice: (productId: string, newPrice: number) => void;
	onUpdateStock: (productId: string, newStock: number) => void;
}

function ProductRow({
	product,
	isEditing,
	onEditStart,
	onEditCancel,
	onUpdatePrice,
	onUpdateStock
}: ProductRowProps) {
	// Temporary values for editing
	const [tempPrice, setTempPrice] = useState(product.price);
	const [tempStock, setTempStock] = useState(product.stock);

	// Check stock levels for visual indicators
	const isStockLow = product.stock <= 10 && product.stock > 0;
	const isStockEmpty = product.stock === 0;

	// Handle price updates with validation
	const handlePriceUpdate = () => {
		if (tempPrice !== product.price) {
			onUpdatePrice(product.id.toString(), tempPrice);
		}
		onEditCancel();
	};

	// Handle stock updates with validation
	const handleStockUpdate = () => {
		if (tempStock !== product.stock) {
			onUpdateStock(product.id.toString(), tempStock);
		}
		onEditCancel();
	};

	// Reset temp values when editing is cancelled
	const handleCancel = () => {
		setTempPrice(product.price);
		setTempStock(product.stock);
		onEditCancel();
	};

	return (
		<tr className="border-b border-slate-100 hover:bg-slate-50">
			{/* Product info column */}
			<td className="py-4 px-4">
				<div className="flex items-center gap-3">
					<span className="text-2xl">{product.emoji}</span>
					<div>
						<div className="font-medium text-slate-900">{product.name}</div>
						<div className="text-sm text-slate-500">
							Initial: {product.initialstock}
						</div>
					</div>
				</div>
			</td>

			{/* Price column */}
			<td className="py-4 px-4">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={tempPrice}
							onChange={(e) => setTempPrice(Number(e.target.value))}
							step={ADMIN_CONSTANTS.PRICE_STEP}
							min={ADMIN_CONSTANTS.MIN_PRICE}
							max={ADMIN_CONSTANTS.MAX_PRICE}
							className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
						/>
						{/* Price adjustment buttons */}
						<button
							onClick={() =>
								setTempPrice((prev) =>
									Math.min(
										prev + ADMIN_CONSTANTS.PRICE_STEP,
										ADMIN_CONSTANTS.MAX_PRICE
									)
								)
							}
							className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
						>
							+
						</button>
						<button
							onClick={() =>
								setTempPrice((prev) =>
									Math.max(
										prev - ADMIN_CONSTANTS.PRICE_STEP,
										ADMIN_CONSTANTS.MIN_PRICE
									)
								)
							}
							className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
						>
							−
						</button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<span className="font-medium">€{product.price.toFixed(2)}</span>
						<button
							onClick={onEditStart}
							className="text-slate-400 hover:text-slate-600 text-sm"
						>
							✏️
						</button>
					</div>
				)}
			</td>

			{/* Stock column */}
			<td className="py-4 px-4">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={tempStock}
							onChange={(e) => setTempStock(Number(e.target.value))}
							step={ADMIN_CONSTANTS.STOCK_STEP}
							min={ADMIN_CONSTANTS.MIN_STOCK}
							max={ADMIN_CONSTANTS.MAX_STOCK}
							className={`w-20 px-2 py-1 border rounded text-sm ${
								isStockEmpty
									? "border-red-300 bg-red-50"
									: isStockLow
									? "border-orange-300 bg-orange-50"
									: "border-slate-300"
							}`}
						/>
						{/* Stock adjustment buttons */}
						<button
							onClick={() =>
								setTempStock((prev) =>
									Math.min(
										prev + ADMIN_CONSTANTS.STOCK_STEP,
										ADMIN_CONSTANTS.MAX_STOCK
									)
								)
							}
							className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
						>
							+
						</button>
						<button
							onClick={() =>
								setTempStock((prev) =>
									Math.max(
										prev - ADMIN_CONSTANTS.STOCK_STEP,
										ADMIN_CONSTANTS.MIN_STOCK
									)
								)
							}
							className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
						>
							−
						</button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<span
							className={`font-medium ${
								isStockEmpty
									? "text-red-600"
									: isStockLow
									? "text-orange-600"
									: "text-slate-900"
							}`}
						>
							{product.stock}
						</span>
						<button
							onClick={onEditStart}
							className="text-slate-400 hover:text-slate-600 text-sm"
						>
							✏️
						</button>
					</div>
				)}
			</td>

			{/* Actions column */}
			<td className="py-4 px-4">
				{isEditing ? (
					<div className="flex items-center gap-2">
						{/* Save button */}
						<button
							onClick={() => {
								handlePriceUpdate();
								handleStockUpdate();
							}}
							className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
						>
							Save
						</button>
						{/* Cancel button */}
						<button
							onClick={handleCancel}
							className="px-3 py-1 bg-slate-300 text-slate-700 rounded text-sm hover:bg-slate-400"
						>
							Cancel
						</button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						{/* Edit button */}
						<button
							onClick={onEditStart}
							className="px-3 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-700"
						>
							Edit
						</button>
					</div>
				)}
			</td>
		</tr>
	);
}
