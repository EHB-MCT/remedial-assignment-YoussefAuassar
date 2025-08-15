import React from "react";
import type { EconomicMetrics } from "../../types/admin";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

interface EconomicOverviewProps {
	metrics: EconomicMetrics;
}

export default function EconomicOverview({ metrics }: EconomicOverviewProps) {
	// Define the metric cards with their display properties and styling
	const metricCards = [
		{
			title: "Total Revenue",
			value: formatCurrency(metrics.totalRevenue),
			color: "text-slate-900",
			bgColor: "bg-slate-50",
			icon: "💰",
			trend: metrics.totalRevenue > 0 ? "↗️" : "➡️",
			tooltip: "Total revenue from all sales"
		},
		{
			title: "Transactions",
			value: metrics.totalTransactions.toString(),
			color: "text-slate-900",
			bgColor: "bg-slate-50",
			icon: "📊",
			trend: metrics.totalTransactions > 0 ? "↗️" : "➡️",
			tooltip: "Total number of transactions"
		},
		{
			title: "Avg Transaction",
			value: formatCurrency(metrics.averageTransactionValue),
			color: "text-slate-900",
			bgColor: "bg-slate-50",
			icon: "📈",
			trend: metrics.averageTransactionValue > 0 ? "↗️" : "➡️",
			tooltip: "Average value per transaction"
		},
		{
			title: "Market Volatility",
			value: metrics.marketVolatility.toFixed(2),
			color:
				metrics.marketVolatility > 1 ? "text-orange-600" : "text-slate-900",
			bgColor: metrics.marketVolatility > 1 ? "bg-orange-50" : "bg-slate-50",
			icon: "📉",
			trend: metrics.marketVolatility > 1 ? "⚠️" : "✅",
			tooltip: "Price volatility - higher means more unstable prices"
		},
		{
			title: "Price Inflation",
			value: formatPercentage(metrics.priceInflation),
			color: metrics.priceInflation >= 0 ? "text-red-600" : "text-green-600",
			bgColor: metrics.priceInflation >= 0 ? "bg-red-50" : "bg-green-50",
			icon: metrics.priceInflation >= 0 ? "📈" : "📉",
			trend: metrics.priceInflation >= 0 ? "↗️" : "↘️",
			tooltip: `Price inflation: ${
				metrics.priceInflation >= 0 ? "Prices are rising" : "Prices are falling"
			}`
		}
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
			{/* Render each metric card */}
			{metricCards.map((card, index) => (
				<div
					key={index}
					className={`rounded-2xl ${card.bgColor} shadow-sm p-4 border border-slate-200 hover:shadow-md transition-all duration-200 cursor-help group relative`}
					title={card.tooltip}
				>
					{/* Card header with icon and trend indicator */}
					<div className="flex items-center justify-between mb-2">
						<span className="text-2xl">{card.icon}</span>
						<span className="text-lg opacity-80">{card.trend}</span>
					</div>

					{/* Metric title and value */}
					<h3 className="text-sm font-medium text-slate-500 mb-1">
						{card.title}
					</h3>
					<p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>

					{/* Enhanced tooltip on hover */}
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
						{card.tooltip}
						<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
					</div>
				</div>
			))}
		</div>
	);
}
