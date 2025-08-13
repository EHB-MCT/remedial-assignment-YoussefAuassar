export interface Product {
	id: string;
	name: string;
	emoji: string;
	price: number;
	stock: number;
	initialStock: number;
	dynamic: boolean;
}

export const initialProducts: Product[] = [
	{
		id: "beer",
		name: "Pils",
		emoji: "🍺",
		price: 3.0,
		stock: 120,
		initialStock: 120,
		dynamic: true
	},
	{
		id: "water",
		name: "Water",
		emoji: "💧",
		price: 2.0,
		stock: 160,
		initialStock: 160,
		dynamic: true
	},
	{
		id: "cola",
		name: "Cola",
		emoji: "🥤",
		price: 2.8,
		stock: 140,
		initialStock: 140,
		dynamic: true
	},
	{
		id: "coffee",
		name: "Koffie",
		emoji: "☕",
		price: 2.2,
		stock: 80,
		initialStock: 80,
		dynamic: true
	}
];
