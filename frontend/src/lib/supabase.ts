// Supabase client setup - connects to the database
import { createClient } from "@supabase/supabase-js";
import type { Product } from "../database/products";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check your .env.local file."
	);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Direct database fetch function
export async function fetchProducts(): Promise<Product[]> {
	try {
		const { data, error } = await supabase.from("products").select("*");

		if (error) {
			console.error("Error fetching products:", error);
			return [];
		}

		if (!data) {
			return [];
		}

		console.log("✅ Successfully fetched products from database:", data);
		return data;
	} catch (error) {
		console.error("Error in fetchProducts:", error);
		return [];
	}
}
