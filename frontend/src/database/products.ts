import { supabase } from "../lib/supabase";

export interface Product {
	id: number; // Changed from string to number to match database int8
	name: string;
	emoji: string;
	price: number;
	stock: number;
	initialstock: number;
}

// Real database query function
export async function getProducts(): Promise<Product[]> {
	console.log("🔍 Attempting to fetch products from Supabase...");
	console.log("🔍 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
	console.log(
		"🔍 Supabase Key exists:",
		!!import.meta.env.VITE_SUPABASE_ANON_KEY
	);

	const { data, error } = await supabase.from("products").select("*");

	if (error) {
		console.error("❌ Error fetching products:", error);
		return [];
	}

	console.log("✅ Successfully fetched products from database:", data);
	return data || [];
}

// Update product in database
export async function updateProduct(
	productId: number, // Changed from string to number
	updates: Partial<Product>
): Promise<boolean> {
	const { error } = await supabase
		.from("products")
		.update(updates)
		.eq("id", productId);

	if (error) {
		console.error("Error updating product:", error);
		return false;
	}

	return true;
}

// Mock data is now commented out in supabase.ts
// No fallback data available - app will crash if database fails
