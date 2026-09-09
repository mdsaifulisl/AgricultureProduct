
import { Route } from 'react-router-dom';
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