import { supabase } from "../lib/supabase";
import type { DBSalesRecord } from "../types/admin";

// Get all sales history
export async function getSalesHistory(): Promise<DBSalesRecord[]> {
	const { data, error } = await supabase
		.from("sales_history")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching sales history:", error);
		return [];
	}

	return data || [];
}

// Add a new sale record
export async function addSaleRecord(sale: DBSalesRecord): Promise<boolean> {
	const { error } = await supabase.from("sales_history").insert([sale]);

	if (error) {
		console.error("Error adding sale record:", error);
		return false;
	}

	return true;
}

// Get sales for a specific product
export async function getProductSales(
	productId: number
): Promise<DBSalesRecord[]> {
	const { data, error } = await supabase
		.from("sales_history")
		.select("*")
		.eq("product_id", productId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching product sales:", error);
		return [];
	}

	return data || [];
}
