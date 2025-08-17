# Database Schema

## Tables

### Products Table

```sql
CREATE TABLE products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  emoji text NOT NULL,
  price numeric NOT NULL,
  stock integer NOT NULL,
  initialstock integer NOT NULL
);
```

### Sales History Table

```sql
CREATE TABLE sales_history (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id bigint NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  price_at_sale numeric NOT NULL,
  revenue numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

## Sample Data

```sql
INSERT INTO products (name, emoji, price, stock, initialstock) VALUES
('Beer', '🍺', 3.50, 100, 100),
('Wine', '🍷', 8.00, 50, 50),
('Cocktail', '🍹', 12.00, 30, 30),
('Soda', '🥤', 2.50, 200, 200);
```

## Relationships

```
products (1) ←→ (many) sales_history
```
