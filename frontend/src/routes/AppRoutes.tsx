import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';

// Public Pages
import Home from '../pages/public/home/Home';
import Shop from '../pages/public/shop/ShopPage';
import { CategoriesPage } from '../pages/public/categories/CategoriesPage';
import { ProductDetails } from '../pages/public/shop/ProductDetails';
import { OffersPage } from '../pages/public/offes/OffersPage';
import { BlogPage } from '../pages/public/blog/BlogPage';
import { BlogDetailsPage } from '../pages/public/blog/BlogDetailsPage';
import { AboutPage } from '../pages/public/about/AboutPage';
import { LoginPage } from '../pages/login/LoginPage';
import { VideosPage } from '../pages/public/videos/VideosPage';
import { CartPage } from '../pages/public/cart/CartPage';
import CheckoutPage from '../pages/public/checkout/CheckoutPage';
export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Main Layout এর আওতাধীন পেজসমূহ */}
      <Route element={<MainLayout />}>
        <Route index path="/" element={<Home />} />
        {/* ভবিষ্যৎ পেজগুলো এখানে যোগ করতে পারবেন, যেমন: */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/post/:id" element={<BlogDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />




      </Route>

      {/* ------------------ 404 NOT FOUND ------------------ */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <h1 className="text-6xl font-black text-emerald-600 mb-2">404</h1>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              পৃষ্ঠাটি পাওয়া যায়নি!
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              পূর্ববর্তী পৃষ্ঠায় ফিরে যান
            </button>
          </div>
        }
      />
    </Routes>
  );
};