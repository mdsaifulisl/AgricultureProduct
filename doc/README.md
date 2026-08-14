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