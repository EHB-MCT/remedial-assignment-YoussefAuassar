# Component Guidelines

## Component Design Principles

### Single Responsibility

- **One purpose per component** - display, logic, or layout
- **Clear interfaces** with typed props
- **Avoid mixing concerns** in single components

```typescript
// Good - Single responsibility
export default function ProductCard({
	product,
	onAddToCart
}: ProductCardProps) {
	return (
		<div className="product-card">
			<h3>{product.name}</h3>
			<p>{formatCurrency(product.price)}</p>
			<button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
		</div>
	);
}
```

### Composition Over Inheritance

- **Build complex UI** from simple components
- **Reusable building blocks**
- **Easy to test and maintain**

```typescript
// Shop.tsx - Composing smaller components
export default function Shop() {
	const { products, cart, cartTotal, addToCart, removeFromCart, checkout } =
		useShop();

	return (
		<div className="shop">
			<ProductGrid products={products} onAddToCart={addToCart} />
			<ShoppingCart
				cart={cart}
				products={products}
				cartTotal={cartTotal}
				removeFromCart={removeFromCart}
				onCheckout={checkout}
			/>
		</div>
	);
}
```

## Component Categories

### Presentational Components

- **Pure display logic** - no side effects
- **Receive data via props**
- **Easy to test and reuse**

```typescript
interface ProductCardProps {
	product: Product;
	onAddToCart: (productId: number) => void;
}

export default function ProductCard({
	product,
	onAddToCart
}: ProductCardProps) {
	const stockPercentage = (product.stock / product.initialstock) * 100;

	return (
		<div className="product-card">
			<span>{product.emoji}</span>
			<h3>{product.name}</h3>
			<p>{formatCurrency(product.price)}</p>
			<div className="stock-bar" style={{ width: `${stockPercentage}%` }} />
			<button
				onClick={() => onAddToCart(product.id)}
				disabled={product.stock <= 0}
			>
				{product.stock > 0 ? "Add to Cart" : "Out of Stock"}
			</button>
		</div>
	);
}
```

### Container Components

- **Manage state and business logic**
- **Connect to hooks/services**
- **Pass data to presentational components**

```typescript
// Shop.tsx
export default function Shop() {
	const {
		products,
		loading,
		cart,
		cartTotal,
		addToCart,
		removeFromCart,
		checkout
	} = useShop();

	if (loading) return <LoadingSpinner />;

	return (
		<div className="shop">
			<ProductGrid products={products} onAddToCart={addToCart} />
			<ShoppingCart
				cart={cart}
				products={products}
				cartTotal={cartTotal}
				removeFromCart={removeFromCart}
				onCheckout={checkout}
			/>
		</div>
	);
}
```

### Complete Component Example

```typescript
// ShoppingCart.tsx - Complete component with proper interface
interface ShoppingCartProps {
	cart: CartItem[];
	products: Product[];
	cartTotal: number;
	removeFromCart: (productId: number, priceAtAdd: number) => void;
	onCheckout: () => void;
}

export default function ShoppingCart({
	cart,
	products,
	cartTotal,
	removeFromCart,
	onCheckout
}: ShoppingCartProps) {
	return (
		<div className="shopping-cart">
			<div className="cart-header">
				<h3>Shopping Cart</h3>
			</div>

			<div className="cart-items">
				{cart.length === 0 ? (
					<p>Your cart is empty</p>
				) : (
					cart.map((item, idx) => (
						<CartRow
							key={`${item.productId}-${idx}`}
							item={item}
							products={products}
							removeFromCart={removeFromCart}
						/>
					))
				)}
			</div>

			<div className="cart-footer">
				<div className="total">Total: {formatCurrency(cartTotal)}</div>
				<button
					onClick={onCheckout}
					disabled={cartTotal === 0}
					className="checkout-button"
				>
					Checkout
				</button>
			</div>
		</div>
	);
}
```

## State Management

### State Location

- **Component state** for UI-only data
- **Custom hooks** for shared business logic
- **Keep state minimal** and normalized

```typescript
// Good - Normalized state
interface ShopState {
	products: Product[];
	cart: CartItem[];
	balance: number;
	loading: boolean;
}

// Avoid - Derived data in state
interface BadState {
	products: Product[];
	cart: CartItem[];
	cartTotal: number; // Calculate this instead
}
```

### State Updates

```typescript
// Functional updates for dependent state
setCart((prevCart) => [...prevCart, newItem]);

// useCallback for event handlers
const handleAddToCart = useCallback(
	(productId: number) => {
		// Handler logic
	},
	[dependencies]
);
```

## Event Handling

### Naming Conventions

```typescript
// Component handlers - "handle" prefix
const handleAddToCart = () => {
	/* ... */
};
const handleRemoveItem = () => {
	/* ... */
};

// Props - "on" prefix
interface Props {
	onAddToCart: (id: number) => void;
	onRemoveItem: (id: number) => void;
}
```

### Performance Optimization

```typescript
// Use useCallback for props
const handleAddToCart = useCallback((productId: number) => {
	addToCart(productId);
}, [addToCart]);

// Avoid inline functions in JSX
// Good
<button onClick={handleAddToCart}>Add</button>
// Bad
<button onClick={() => onAddToCart(product.id)}>Add</button>
```

## Performance Guidelines

### Memoization

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
	return calculateComplexValue(data);
}, [data]);

// Memoize stable components
const MemoizedProductCard = React.memo(ProductCard);
```

### Component Splitting

```typescript
// Split large components into focused ones
function AdminDashboard() {
	return (
		<div>
			<EconomicOverview metrics={metrics} />
			<ProductManagement products={products} />
			<SalesAnalytics selectedProduct={selectedProduct} />
		</div>
	);
}
```

## Accessibility

### Semantic HTML

```typescript
// Use proper HTML elements
<nav>
	<ul>
		<li><button onClick={() => setTab("shop")}>Shop</button></li>
		<li><button onClick={() => setTab("admin")}>Admin</button></li>
	</ul>
</nav>

// Proper form elements
<form onSubmit={handleSubmit}>
	<label htmlFor="price">Price</label>
	<input id="price" type="number" value={price} />
</form>
```

### ARIA Attributes

```typescript
<button
	aria-label={`Add ${product.name} to cart`}
	disabled={product.stock <= 0}
	aria-disabled={product.stock <= 0}
>
	Add to Cart
</button>
```

## Testing Guidelines

### Component Testing

```typescript
// Test user interactions, not implementation
test("adds product to cart when button clicked", () => {
	const mockAddToCart = jest.fn();
	render(<ProductCard product={product} onAddToCart={mockAddToCart} />);

	fireEvent.click(screen.getByText("Add to Cart"));

	expect(mockAddToCart).toHaveBeenCalledWith(product.id);
});

// Test edge cases
test("disables button when product out of stock", () => {
	const outOfStockProduct = { ...product, stock: 0 };
	render(<ProductCard product={outOfStockProduct} onAddToCart={jest.fn()} />);

	expect(screen.getByText("Out of Stock")).toBeDisabled();
});
```
