# Architecture Overview

## System Architecture

Service-Oriented Architecture with clear separation of concerns and modern React patterns.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Shop UI   │  │  Admin UI   │  │   Navigation UI     │  │
│  │             │  │             │  │                     │  │
│  │ - ProductGrid│  │ - Dashboard │  │ - Tab Switching     │  │
│  │ - Cart      │  │ - Analytics │  │ - Responsive Design │  │
│  │ - Balance   │  │ - Management│  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Hook Layer                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐              ┌─────────────────────────────┐│
│  │  useShop    │              │         useAdmin            ││
│  │             │              │                             ││
│  │ - Cart Mgmt │              │ - Product Management        ││
│  │ - Balance   │              │ - Analytics                 ││
│  │ - Checkout  │              │ - Economic Metrics          ││
│  └─────────────┘              └─────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer                              │
├─────────────────────────────────────────────────────────────┤
│┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐│
││ AdminService │ │PricingService│ │   AnalyticsService      ││
││              │ │              │ │                         ││
││ - CRUD Ops   │ │ - Strategy   │ │ - Economic Calculations ││
││ - Business   │ │ - Price Calc │ │ - Market Analysis       ││
││   Logic      │ │ - Updates    │ │ - Statistics            ││
│└──────────────┘ └──────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Database Layer                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐              ┌─────────────────────────────┐│
│  │  Products   │              │      Sales History          ││
│  │             │              │                             ││
│  │ - CRUD      │              │ - Transaction Records       ││
│  │ - Schema    │              │ - Analytics Data            ││
│  │ - Types     │              │ - Historical Pricing        ││
│  └─────────────┘              └─────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL)                         │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### Layered Architecture

- **Presentation**: React components (UI only)
- **Business Logic**: Custom hooks and services
- **Data Access**: Repository pattern with type safety
- **Persistence**: Supabase PostgreSQL

### Service Design

- **AdminService**: Product management and business operations
- **PricingService**: Dynamic pricing with Strategy pattern
- **AnalyticsService**: Economic metrics and market analysis

### Design Patterns

- **Strategy Pattern**: Interchangeable pricing algorithms
- **Custom Hooks**: Reusable stateful logic
- **Repository Pattern**: Abstracted data access
- **Observer Pattern**: React's built-in state management

## Data Flow

### Shopping Flow

```
User Action → useShop → AdminService → Database → UI Update
```

### Admin Management

```
Admin Input → useAdmin → AdminService → PricingService → Database → Analytics
```

### Dynamic Pricing

```
Sale Event → Analytics → Pricing Strategy → Price Update → Database
```

## Technology Stack

### Frontend

- **React 19** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend

- **Supabase** for real-time database
- **PostgreSQL** for data persistence
- **Environment variables** for configuration

## Scalability & Maintainability

### Performance

- Service layer separation for optimization
- Database indexing for query performance
- React optimization with proper dependencies

### Code Quality

- Modular structure for independent development
- Clear interfaces between layers
- Comprehensive TypeScript definitions

### Extensibility

- Strategy pattern for new pricing algorithms
- Service architecture for new features
- Component modularity for UI changes

## Security

- Environment variables for sensitive data
- Type-safe queries prevent injection
- Input validation at service layer
- Separation of shop and admin concerns
