// Supabase client setup - connects to the database
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hecovdqybmqtwmgobhak.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlY292ZHF5Ym1xdHdtZ29iaGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzIzMzgsImV4cCI6MjA3MDg0ODMzOH0.0RBgecGDyLywrSVmPlK-0TsPvWjDlFDMTVsqKayUlps";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Product interface matching your database
export interface Product {
	id: number;
	name: string;
	emoji: string;
	price: number;
	stock: number;
	initialstock: number;
}

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
