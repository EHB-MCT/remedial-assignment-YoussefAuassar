# Design Patterns

## Overview

The Festival Drink Simulator implements key design patterns for maintainable, scalable code.

## Strategy Pattern

### Purpose

**Dynamic pricing algorithms** that can be swapped at runtime without changing existing code.

### Implementation

```typescript
// Strategy interface
export interface PricingStrategy {
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours?: number
	): number;
}

// Concrete strategies
export class DemandBasedPricing implements PricingStrategy {
	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours: number = 24
	): number {
		const now = Date.now();
		const timeWindow = timeWindowHours * 60 * 60 * 1000;

		// Get recent sales for this product
		const recentSales = salesHistory.filter(
			(sale) =>
				sale.productId === product.id.toString() &&
				now - sale.timestamp <= timeWindow
		);

		const totalRecentSales = recentSales.reduce(
			(sum, sale) => sum + sale.quantity,
			0
		);
		const basePrice = product.price;

		// Calculate demand factor
		const demandFactor = this.calculateDemandFactor(totalRecentSales);

		// Apply bounds
		const newPrice = basePrice * demandFactor;
		const minPrice = basePrice * 0.7;
		const maxPrice = basePrice * 1.5;

		return Math.max(minPrice, Math.min(maxPrice, newPrice));
	}

	private calculateDemandFactor(recentSales: number): number {
		if (recentSales >= 10) return 1.3; // High demand: +30%
		if (recentSales >= 5) return 1.15; // Moderate: +15%
		if (recentSales >= 2) return 1.0; // Normal: no change
		if (recentSales >= 1) return 0.95; // Low: -5%
		return 0.8; // Very low demand: -20%
	}
}

export class SupplyBasedPricing implements PricingStrategy {
	calculatePrice(product: Product): number {
		const stockRatio = product.stock / product.initialstock;
		const basePrice = product.price;

		// Low stock = higher price (scarcity)
		let stockFactor = 1.0;
		if (stockRatio <= 0.1) stockFactor = 1.2;
		else if (stockRatio <= 0.3) stockFactor = 1.1;
		else if (stockRatio >= 0.8) stockFactor = 0.95;

		const newPrice = basePrice * stockFactor;
		const minPrice = basePrice * 0.8;
		const maxPrice = basePrice * 1.4;

		return Math.max(minPrice, Math.min(maxPrice, newPrice));
	}
}

// Context
export class PricingService {
	private strategy: PricingStrategy;

	constructor(strategy: PricingStrategy = new HybridPricing()) {
		this.strategy = strategy;
	}

	setStrategy(strategy: PricingStrategy): void {
		this.strategy = strategy;
	}

	calculatePrice(
		product: Product,
		salesHistory: SalesRecord[],
		timeWindowHours?: number
	): number {
		return this.strategy.calculatePrice(product, salesHistory, timeWindowHours);
	}
}
```

**Benefits:**

- Easy to add new pricing algorithms
- Runtime strategy switching
- Testable in isolation

## Service Layer Pattern

### Purpose

**Encapsulates business logic** and provides unified interface for data operations.

### Implementation

```typescript
export class AdminService {
	// Product management
	static async getProducts(): Promise<Product[]> {
		try {
			return await dbGetProducts();
		} catch (error) {
			console.error("Failed to fetch products:", error);
			return [];
		}
	}

	static async updateProductPrice(
		products: Product[],
		productId: string,
		newPrice: number
	): Promise<Product[]> {
		const success = await dbUpdateProductPrice(parseInt(productId), newPrice);

		if (success) {
			return products.map((p) =>
				p.id === parseInt(productId) ? { ...p, price: newPrice } : p
			);
		}
		return products;
	}

	// Dynamic pricing
	static async applyDynamicPricing(
		productId: string,
		products: Product[],
		salesHistory: SalesRecord[]
	): Promise<Product[]> {
		const pricingService = new PricingService();
		const product = products.find((p) => p.id === parseInt(productId));

		if (!product) return products;

		const newPrice = pricingService.calculatePrice(product, salesHistory);
		return this.updateProductPrice(products, productId, newPrice);
	}
}
```

**Benefits:**

- Separation of business logic from UI
- Reusable across components
- Centralized business rules

## Repository Pattern

### Purpose

**Abstracts data access** and provides consistent database interface.

### Implementation

```typescript
// Product repository
export async function getProducts(): Promise<Product[]> {
	const { data, error } = await supabase.from("products").select("*");

	if (error) {
		console.error("Error fetching products:", error);
		return [];
	}

	return data || [];
}

export async function updateProductPrice(
	productId: number,
	newPrice: number
): Promise<boolean> {
	const { error } = await supabase
		.from("products")
		.update({ price: newPrice })
		.eq("id", productId);

	return !error;
}

// Sales repository
export async function addSaleRecord(sale: DBSalesRecord): Promise<boolean> {
	const { error } = await supabase.from("sales_history").insert([sale]);
	return !error;
}
```

**Benefits:**

- Database implementation hidden from business logic
- Easy to mock for testing
- Consistent data access patterns

## Custom Hooks Pattern

### Purpose

**Encapsulates stateful logic** and makes it reusable across components.

### Implementation

```typescript
// Shop hook
export function useShop() {
	const [products, setProducts] = useState<Product[]>([]);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [balance, setBalance] = useState(50);
	const [loading, setLoading] = useState(true);

	// Load products from database on component mount
	useEffect(() => {
		async function loadProducts() {
			try {
				setLoading(true);
				const dbProducts = await getProducts();
				if (dbProducts && dbProducts.length > 0) {
					setProducts(dbProducts);
				} else {
					setProducts([]);
				}
			} catch (error) {
				console.error("Error loading products:", error);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		}
		loadProducts();
	}, []);

	const addToCart = (pid: number) => {
		setProducts((prev) =>
			prev.map((p) =>
				p.id === pid && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p
			)
		);

		const price = currentPrice(pid);
		setCart((prev) => [...prev, { productId: pid, qty: 1, priceAtAdd: price }]);
	};

	const removeFromCart = (pid: number, priceAtAdd: number) => {
		setCart((prev) =>
			prev.filter(
				(item) => !(item.productId === pid && item.priceAtAdd === priceAtAdd)
			)
		);
		setProducts((prev) =>
			prev.map((p) => (p.id === pid ? { ...p, stock: p.stock + 1 } : p))
		);
	};

	const cartTotal = cart.reduce(
		(sum, item) => sum + item.qty * item.priceAtAdd,
		0
	);

	return {
		products,
		cart,
		balance,
		loading,
		addToCart,
		removeFromCart,
		cartTotal,
		setBalance,
		setProducts
	};
}

// Admin hook
export function useAdmin() {
	const [products, setProducts] = useState<Product[]>([]);
	const [salesHistory, setSalesHistory] = useState<SalesRecord[]>([]);

	const updateProductPrice = useCallback(
		async (productId: string, newPrice: number) => {
			const updatedProducts = await AdminService.updateProductPrice(
				products,
				productId,
				newPrice
			);
			setProducts(updatedProducts);
		},
		[products]
	);

	return { products, salesHistory, updateProductPrice };
}
```

**Benefits:**

- Reusable business logic
- Clean component separation
- Testable with React Testing Library

## Observer Pattern (React Built-in)

### Purpose

**Automatically update UI** when state changes.

### Implementation

```typescript
// Components automatically re-render when hook state changes
function ShopPage() {
	const { products, addToCart } = useShop(); // Observes shop state
	return <ProductGrid products={products} onAddToCart={addToCart} />;
}

function AdminPage() {
	const { products, updateProductPrice } = useAdmin(); // Observes admin state
	return (
		<ProductManagement products={products} onUpdatePrice={updateProductPrice} />
	);
}
```

**Benefits:**

- Automatic UI synchronization
- Loose coupling between components
- Reactive programming model

## Pattern Interaction

### How They Work Together

```typescript
// Complete flow demonstrating pattern interaction
function AdminDashboard() {
	// Observer: component observes hook state
	const { products, updateProductPrice } = useAdmin();

	const handlePriceUpdate = (productId: string, newPrice: number) => {
		// Hook → Service Layer → Repository → Strategy → Observer
		updateProductPrice(productId, newPrice);
	};

	return (
		<ProductManagement products={products} onUpdatePrice={handlePriceUpdate} />
	);
}
```

**Flow:**

1. **Hook** manages component state
2. **Service** handles business logic
3. **Repository** manages data access
4. **Strategy** provides flexible algorithms
5. **Observer** updates UI automatically

**Results:**

- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to add features
- **Testable**: Each layer tested independently
- **Flexible**: Components easily modified
