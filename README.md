# Festival Drink Simulator

A modern festival economy simulation application built with React, TypeScript, and Supabase, featuring dynamic pricing algorithms and comprehensive analytics for managing a virtual drink business.

## Features

🍻 **Festival Drink Shop**

- Interactive product catalog with emoji-based drink display
- Real-time stock tracking with visual indicators
- Shopping cart functionality with balance management
- Responsive design for all devices

🏛️ **Admin Dashboard**

- Economic overview with key metrics
- Product management (price and stock updates)
- Sales analytics and performance tracking
- Dynamic pricing with multiple strategies
- Market volatility and inflation monitoring
- Leaderboard for top-performing products

⚡ **Dynamic Pricing Engine**

- Demand-based pricing strategy
- Supply-based pricing strategy
- Hybrid pricing combining both approaches
- Real-time price adjustments based on market conditions

📊 **Analytics & Insights**

- Comprehensive sales tracking
- Revenue and transaction analytics
- Price history and trend analysis
- Market volatility calculations
- Economic metrics dashboard

💾 **Data Persistence**

- Supabase backend integration
- Real-time data synchronization
- Persistent sales history
- Product state management

## 🏗️ Architecture

The application follows a modern, service-oriented architecture with clear separation of concerns:

- **Component-based UI** with React and TypeScript
- **Service Layer** for business logic (Pricing, Analytics, Admin)
- **Strategy Pattern** for dynamic pricing algorithms
- **Database Layer** with Supabase integration
- **Custom Hooks** for state management

For detailed architecture information, see the [Architecture Documentation](docs/architecture.md) and project structure below.

## 🚀 Tech Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: React Hooks with Custom Hooks Pattern
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Linting**: ESLint

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
VITE_SUPABASE_URL=https://hecovdqybmqtwmgobhak.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlY292ZHF5Ym1xdHdtZ29iaGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzIzMzgsImV4cCI6MjA3MDg0ODMzOH0.0RBgecGDyLywrSVmPlK-0TsPvWjDlFDMTVsqKayUlps
```

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/src/
├── components/           # React components
│   ├── admin/           # Admin dashboard components
│   │   ├── EconomicOverview.tsx    # Economic metrics display
│   │   ├── Leaderboard.tsx         # Top products ranking
│   │   ├── ProductManagement.tsx   # Product editing interface
│   │   ├── ProductSelector.tsx     # Product selection dropdown
│   │   └── SalesAnalytics.tsx      # Sales data visualization
│   ├── common/          # Shared components
│   │   └── Navigation.tsx          # App navigation
│   └── shop/            # Shopping interface components
│       ├── CartRow.tsx             # Shopping cart item
│       ├── ProductCard.tsx         # Product display card
│       ├── ProductGrid.tsx         # Product catalog grid
│       └── ShoppingCart.tsx        # Cart component
├── constants/           # Application constants
│   └── storage.ts                  # Configuration constants
├── database/            # Database operations
│   ├── products.ts                 # Product CRUD operations
│   └── sales.ts                    # Sales transaction handling
├── hooks/               # Custom React hooks
│   ├── useAdmin.ts                 # Admin functionality hook
│   └── useShop.ts                  # Shop functionality hook
├── lib/                 # Core libraries
│   └── supabase.ts                 # Supabase client configuration
├── pages/               # Main application pages
│   ├── Admin.tsx                   # Admin dashboard page
│   └── Shop.tsx                    # Shopping interface page
├── services/            # Business logic services
│   ├── adminService.ts             # Admin operations service
│   ├── analytics/
│   │   └── AnalyticsService.ts     # Economic calculations
│   └── pricing/
│       ├── PricingService.ts       # Pricing service orchestrator
│       └── PricingStrategy.ts      # Pricing algorithm strategies
├── types/               # TypeScript type definitions
│   ├── admin.ts                    # Admin-related types
│   └── cart.ts                     # Cart and shopping types
└── utils/               # Utility functions
    ├── currency.ts                 # Currency formatting
    └── formatters.ts               # Data formatting utilities
```

## 🏛️ Design Patterns

The project implements several key design patterns:

### Strategy Pattern

- **PricingStrategy**: Multiple pricing algorithms (Demand-based, Supply-based, Hybrid)
- **Dynamic switching**: Runtime strategy selection for different market conditions

### Service Layer Pattern

- **AdminService**: Admin operations orchestration
- **AnalyticsService**: Economic calculations and market analysis
- **PricingService**: Price calculation and updates

### Custom Hooks Pattern

- **useAdmin**: Admin dashboard state management
- **useShop**: Shopping interface state management
- Clean separation of UI and business logic

### Repository Pattern

- **Database layer**: Abstracted database operations
- **Type-safe**: Full TypeScript integration
- **Error handling**: Comprehensive error management

## 🎯 Key Features Deep Dive

### Dynamic Pricing Engine

The application features a sophisticated pricing system with three strategies:

1. **Demand-Based Pricing**: Adjusts prices based on recent sales volume
2. **Supply-Based Pricing**: Modifies prices according to stock levels
3. **Hybrid Pricing**: Combines both strategies (60% demand, 40% supply)

### Economic Simulation

- **Real-time metrics**: Revenue, transactions, market volatility
- **Price inflation tracking**: Economic health indicators
- **Market analysis**: Comprehensive business intelligence

### Admin Dashboard

- **Product management**: Real-time price and stock updates
- **Sales analytics**: Historical performance tracking
- **Economic overview**: Key performance indicators

### Shopping Experience

- **Balance management**: User credit system
- **Cart functionality**: Add/remove items with price tracking
- **Stock visualization**: Real-time inventory indicators

## 🔐 Database Schema

The application uses Supabase with the following main tables:

### Products Table

```sql
- id (int8, primary key)
- name (text)
- emoji (text)
- price (numeric)
- stock (int4)
- initialstock (int4)
```

### Sales History Table

```sql
- id (int8, primary key)
- product_id (int8, foreign key to products.id)
- quantity (int4)
- price_at_sale (numeric)
- revenue (numeric)
- created_at (timestamp with time zone)
```

## 📊 Analytics Features

### Economic Metrics

- Total revenue tracking
- Transaction volume analysis
- Average transaction value
- Market volatility calculations
- Price inflation monitoring

### Product Analytics

- Individual product performance
- Sales history and trends
- Price optimization suggestions
- Stock level analysis
- Demand pattern recognition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Educational Context

This project was developed as part of a remedial assignment demonstrating:

- **Advanced React patterns** and TypeScript integration
- **Service-oriented architecture** design
- **Dynamic pricing algorithms** implementation
- **Real-time data management** with Supabase
- **Modern UI/UX principles** with Tailwind CSS

## 📚 References

### Official Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Design Patterns & Best Practices

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Design Patterns](https://refactoring.guru/design-patterns/typescript)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)

### UI/UX Resources

- [Lucide Icons](https://lucide.dev/)
- [Tailwind UI](https://tailwindui.com/)

## 👤 Author

**Youssef Auassar**

- ✉️ Email: youssef.auassar@student.ehb.be
- 💻 GitHub: [YoussefAuassar]
