/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import Home from '../pages/public/home/Home';

const Shop = lazy(() => import('../pages/public/shop/ShopPage'));
const CategoriesPage = lazy(() => import('../pages/public/categories/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const ProductDetails = lazy(() => import('../pages/public/shop/ProductDetails').then((module) => ({ default: module.ProductDetails })));
const OffersPage = lazy(() => import('../pages/public/offes/OffersPage'));
const BlogPage = lazy(() => import('../pages/public/blog/BlogPage'));
const BlogDetailsPage = lazy(() => import('../pages/public/blog/BlogDetailsPage'));
const AboutPage = lazy(() => import('../pages/public/about/AboutPage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const VideosPage = lazy(() => import('../pages/public/videos/VideosPage').then((module) => ({ default: module.VideosPage })));
const CartPage = lazy(() => import('../pages/public/cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/public/checkout/CheckoutPage'));

export const publicRoutes = (
  <>
    <Route index path="/" element={<Home />} />
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
  </>
);
