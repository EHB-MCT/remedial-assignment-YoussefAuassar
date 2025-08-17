/**
 * Database operations for sales transaction management.
 * Handles all CRUD operations for the sales_history table in Supabase.
 */

import { supabase } from "../lib/supabase";
import type { DBSalesRecord } from "../types/admin";

/**
 * Retrieves all sales history from the database.
 *
 * @returns {Promise<DBSalesRecord[]>} Array of all sales records, ordered by creation date (newest first).
 */
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

/**
 * Adds a new sale record to the database.
 *
 * @param {DBSalesRecord} sale - The sale record to insert.
 * @returns {Promise<boolean>} True if insertion successful, false otherwise.
 */
export async function addSaleRecord(sale: DBSalesRecord): Promise<boolean> {
	const { error } = await supabase.from("sales_history").insert([sale]);

	if (error) {
		console.error("Error adding sale record:", error);
		return false;
	}

	return true;
}

/**
 * Retrieves sales history for a specific product.
 *
 * @param {number} productId - The ID of the product to get sales for.
 * @returns {Promise<DBSalesRecord[]>} Array of sales records for the product, ordered by creation date.
 */
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
