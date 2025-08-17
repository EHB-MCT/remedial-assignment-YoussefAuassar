# Code Organization

## Project Structure

The Festival Drink Simulator follows a feature-based organization with clear separation of concerns.

```
frontend/src/
├── components/              # UI Components
│   ├── admin/              # Admin-specific components
│   │   ├── EconomicOverview.tsx     # Economic metrics dashboard
│   │   ├── Leaderboard.tsx          # Top products ranking
│   │   ├── ProductManagement.tsx    # Product CRUD interface
│   │   ├── ProductSelector.tsx      # Product selection dropdown
│   │   └── SalesAnalytics.tsx       # Sales data visualization
│   ├── common/             # Shared components
│   │   └── Navigation.tsx           # Application navigation
│   └── shop/               # Shop-specific components
│       ├── CartRow.tsx              # Individual cart item
│       ├── ProductCard.tsx          # Product display card
│       ├── ProductGrid.tsx          # Product catalog
│       └── ShoppingCart.tsx         # Shopping cart interface
├── constants/              # Application constants
│   └── storage.ts                   # Configuration values
├── database/               # Database operations
│   ├── products.ts                  # Product CRUD operations
│   └── sales.ts                     # Sales transaction handling
├── hooks/                  # Custom React hooks
│   ├── useAdmin.ts                  # Admin dashboard logic
│   └── useShop.ts                   # Shopping cart logic
├── lib/                    # External library configurations
│   └── supabase.ts                  # Supabase client setup
├── pages/                  # Main application pages
│   ├── Admin.tsx                    # Admin dashboard page
│   └── Shop.tsx                     # Shopping interface page
├── services/               # Business logic services
│   ├── adminService.ts              # Admin operations
│   ├── analytics/
│   │   └── AnalyticsService.ts      # Economic calculations
│   └── pricing/
│       ├── PricingService.ts        # Pricing orchestrator
│       └── PricingStrategy.ts       # Pricing algorithms
├── types/                  # TypeScript definitions
│   ├── admin.ts                     # Admin-related types
│   └── cart.ts                      # Shopping cart types
└── utils/                  # Utility functions
    ├── currency.ts                  # Currency formatting
    └── formatters.ts                # Data formatting
```

## Organization Principles

### 1. **Feature-Based Structure**

Components are organized by feature area (admin, shop, common) rather than by technical role.

**Benefits:**

- Easy to locate related functionality
- Supports team development by feature
- Clear ownership and responsibility

### 2. **Layered Separation**

Clear separation between:

- **Presentation** (`components/`, `pages/`)
- **Business Logic** (`services/`, `hooks/`)
- **Data Access** (`database/`)
- **Configuration** (`constants/`, `lib/`)

### 3. **Type Safety**

Centralized type definitions in `types/` folder:

- Shared interfaces and types
- Database schema representations
- Component prop definitions

## File Naming Conventions

### Components

- **PascalCase** for component files: `ProductCard.tsx`
- **Descriptive names** that indicate purpose
- **Feature prefixes** where appropriate

### Services

- **camelCase** for service files: `adminService.ts`
- **Service suffix** for business logic: `PricingService.ts`
- **Class exports** for stateful services

### Types

- **camelCase** for type files: `admin.ts`
- **Interface exports** with descriptive names
- **Grouped by feature area**

### Utilities

- **camelCase** for utility files: `currency.ts`
- **Function exports** for pure functions
- **Single responsibility per file**

## Import Organization

### Import Order

1. **External libraries** (React, Supabase)
2. **Internal types** and interfaces
3. **Local components** and utilities
4. **Relative imports** last

```typescript
// External libraries
import React from "react";
import { createClient } from "@supabase/supabase-js";

// Internal types
import type { Product } from "../types/admin";

// Local utilities
import { formatCurrency } from "../utils/currency";

// Relative imports
import ProductCard from "./ProductCard";
```

### Path Conventions

- **Relative paths** for same-level imports
- **Absolute paths** from `src/` for cross-feature imports
- **Type-only imports** where appropriate

## Component Organization

### Component Structure

```typescript
// 1. External imports
import React from "react";

// 2. Type imports
import type { ComponentProps } from "../types";

// 3. Internal imports
import { utilityFunction } from "../utils";

// 4. Component definition
export default function ComponentName({ props }: ComponentProps) {
	// Component logic
}
```

### Hook Organization

```typescript
// 1. State declarations
const [state, setState] = useState();

// 2. Effect declarations
useEffect(() => {
	// Effect logic
}, [dependencies]);

// 3. Event handlers
const handleEvent = useCallback(() => {
	// Handler logic
}, [dependencies]);

// 4. Return statement
return {
	// Hook interface
};
```

## Service Organization

### Service Structure

```typescript
export class ServiceName {
	// 1. Static methods for stateless operations
	static async operation(): Promise<Result> {
		// Implementation
	}

	// 2. Instance methods for stateful operations
	async instanceOperation(): Promise<Result> {
		// Implementation
	}

	// 3. Private helper methods
	private helperMethod(): void {
		// Implementation
	}
}
```

### Error Handling

- **Consistent error handling** across all services
- **Logging** for debugging and monitoring
- **Graceful degradation** for non-critical operations

## Database Organization

### Database Operations

- **Separate files** for each table/entity
- **Type-safe operations** with TypeScript
- **Error handling** for all database calls
- **Consistent naming** following database schema

### Schema Consistency

- **Interface definitions** matching database schema
- **Transformation functions** between DB and UI types
- **Validation** at service layer

## Testing Organization (Future Enhancement)

### Proposed Structure

```
__tests__/
├── components/             # Component tests
├── services/               # Service layer tests
├── hooks/                  # Custom hook tests
├── utils/                  # Utility function tests
└── integration/            # End-to-end tests
```

### Testing Strategy

- **Unit tests** for pure functions and services
- **Component tests** for UI behavior
- **Integration tests** for complete workflows
- **Database tests** for data operations

## Build Organization

### Development

- **Vite** for fast development server
- **TypeScript** for compile-time checking
- **ESLint** for code quality
- **Hot reloading** for rapid development

### Production

- **Optimized builds** with code splitting
- **Environment variables** for configuration
- **Type checking** before build
- **Asset optimization** for performance
