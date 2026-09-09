src/
├── assets/             # Images, logos, SVG
├── components/         # Reusable Component (Navbar, Footer, ProductCard, Modals)
│   ├── common/         # Navbar, Footer, LoadingSpinner, Button
│   ├── modals/         # AuthModal (Login/Register Modal)
│   └── product/        # ProductCard, CategoryCard
├── layouts/            # Layout Wrappers
│   ├── MainLayout.tsx  # Navbar + Footer + Outlet (Public Pages)
│   └── SellerLayout.tsx# Sidebar + Outlet (Seller Dashboard)
├── pages/              # SRS অনুযায়ী প্রতিটি পেজ
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductDetails.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── OrderSuccess.tsx
│   └── seller/         # Seller Dashboard Pages
│       ├── DashboardOverview.tsx
│       ├── MyProducts.tsx
│       ├── AddProduct.tsx
│       ├── OrderManagement.tsx
│       └── Settings.tsx
├── redux/              # State Management
│   ├── store.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       └── filterSlice.ts
├── routes/             # App Router & Private Routes
│   ├── AppRoutes.tsx
│   └── PrivateRoute.tsx
├── types/              # TypeScript Types/Interfaces
│   └── index.ts
├── App.tsx
└── main.tsx





server/
├── prisma/
│   └── schema.prisma          <-- Database Schema & Models
├── src/
│   ├── config/                <-- Database & App Configurations
│   │   ├── env.ts
│   │   └── prisma.ts
│   ├── controllers/           <-- Request & Response Controllers
│   │   └── user.controller.ts
│   ├── interfaces/            <-- Custom TypeScript Types & Interfaces
│   │   └── index.d.ts
│   ├── middlewares/           <-- Global Error, Auth, Upload Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── upload.middleware.ts
│   ├── routes/                <-- API Route Declarations
│   │   ├── index.ts
│   │   └── user.route.ts
│   ├── services/              <-- Database Queries via Prisma (Business Logic)
│   │   └── user.service.ts
│   ├── utils/                 <-- Utility Functions (jwt, response helpers)
│   │   └── catchAsync.ts
│   ├── app.ts                 <-- Express App, Cors, Middlewares & Routes Mount
│   └── server.ts              <-- Server Listener & Database Connection
├── .env
├── package.json
├── PRISMA.md
└── tsconfig.json