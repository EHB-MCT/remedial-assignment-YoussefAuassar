# Language and System Conventions

## TypeScript Conventions

### Code Style

- Use **camelCase** for variable and function names
- Use **PascalCase** for class and component names
- Use **single quotes** for strings, except to avoid escaping
- End statements with **semicolons**
- Use **2 spaces** for indentation

```typescript
// Good examples
const productList = ["beer", "wine"];
class AdminService {}
function calculateTotal() {}
interface ProductCardProps {}
```

### Project Structure

- **Organize files by feature** or domain
- Keep **components small and focused**
- Use **index files** for re-exports
- **Separate concerns**: UI, business logic, data access

### Best Practices

- Write **descriptive comments** and JSDoc for functions and classes
- Use **TypeScript** for type safety
- Follow the **DRY** (Don't Repeat Yourself) principle
- Use **meaningful names** for variables and functions

```typescript
/**
 * Calculates cart total with tax
 * @param items - Cart items array
 * @returns Total price including tax
 */
function calculateCartTotal(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.price, 0);
}
```

## React Conventions

### Component Structure

- Use **functional components** with hooks
- Separate **presentational** and **container** components
- Use **TypeScript** for type checking

```typescript
// Presentational component
interface ProductCardProps {
	product: Product;
	onAddToCart: (id: number) => void;
}

export default function ProductCard({
	product,
	onAddToCart
}: ProductCardProps) {
	return (
		<div>
			<h3>{product.name}</h3>
			<button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
		</div>
	);
}
```

### State Management

- Use **custom hooks** for reusable logic
- Keep **local state** within components when possible
- Use **useCallback** and **useMemo** for optimization

### Styling

- Use **Tailwind CSS** utility-first approach
- Keep **styles scoped** to components
- Use **responsive design** patterns

## Supabase Conventions

### Database Schema

- Use **bigint** for primary keys with IDENTITY
- Include **created_at** timestamps with time zone
- Use **foreign keys** for relationships
- Use **numeric** type for currency values

```sql
-- Example table structure
CREATE TABLE products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

### Database Operations

- Use **type-safe** database operations
- Handle **errors gracefully**
- Use **transactions** for complex operations

```typescript
export async function getProducts(): Promise<Product[]> {
	const { data, error } = await supabase.from("products").select("*");

	if (error) {
		console.error("Database error:", error);
		return [];
	}

	return data || [];
}
```

## Git Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add dynamic pricing algorithm
fix: resolve cart calculation error
docs: update API documentation
refactor: extract pricing service
style: format code with prettier
test: add component unit tests
```

### Branch Naming

```bash
feature/dynamic-pricing-system
fix/cart-calculation-error
docs/api-documentation
refactor/service-layer-cleanup
```

## Error Handling

### Consistent Patterns

- Use **try-catch** blocks for async operations
- Return **boolean** or **null** for simple operations
- Log **errors** with context
- Provide **user-friendly** error messages

```typescript
async function updateProduct(
	id: number,
	updates: Partial<Product>
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from("products")
			.update(updates)
			.eq("id", id);

		if (error) {
			console.error("Database error:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Unexpected error:", error);
		return false;
	}
}
```

## References

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Style Guides

- [Conventional Commits](https://www.conventionalcommits.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Examples

```typescript
// Complete component example
import { useState, useCallback } from "react";
import type { Product } from "../database/products";
import { formatCurrency } from "../utils/currency";

interface ProductCardProps {
	product: Product;
	onAddToCart: (id: number) => void;
}

export default function ProductCard({
	product,
	onAddToCart
}: ProductCardProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleAddToCart = useCallback(async () => {
		setIsLoading(true);
		try {
			await onAddToCart(product.id);
		} finally {
			setIsLoading(false);
		}
	}, [product.id, onAddToCart]);

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold">{product.name}</h3>
			<p className="text-gray-600">{formatCurrency(product.price)}</p>
			<button
				onClick={handleAddToCart}
				disabled={isLoading || product.stock <= 0}
				className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
			>
				{isLoading ? "Adding..." : "Add to Cart"}
			</button>
		</div>
	);
}
```
