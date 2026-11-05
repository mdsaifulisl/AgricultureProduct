import { lazy } from 'react';
import { Route } from 'react-router-dom';

const SellerDashboard = lazy(() => import('../pages/seller/dashboard/SellerDashboard').then((module) => ({ default: module.SellerDashboard })));
const ProductsList = lazy(() => import('../pages/seller/products/ProductsList'));
const AddEditProduct = lazy(() => import('../pages/seller/products/AddEditProduct'));
const SellerOrders = lazy(() => import('../pages/seller/order/Orders'));
const CategoriesList = lazy(() => import('../pages/seller/categories/CategoriesList').then((module) => ({ default: module.CategoriesList })));
const SlidersList = lazy(() => import('../pages/seller/sliders/SlidersList').then((module) => ({ default: module.SlidersList })));
const VideosList = lazy(() => import('../pages/seller/videos/VideosList').then((module) => ({ default: module.VideosList })));
const ManageProducts = lazy(() => import('../pages/seller/partners_logo/ManagePartners'));
const SellerBlogs = lazy(() => import('../pages/seller/blog/SellerBlogs').then((module) => ({ default: module.SellerBlogs })));
const SiteSettings = lazy(() => import('../pages/seller/settings/SiteSettings'));
const UserManagement = lazy(() => import('../pages/seller/settings/UserManagement'));
const ChangePassword = lazy(() => import('../pages/seller/settings/ChangePassword'));
const ManageAboutSettings = lazy(() => import('../pages/seller/about/ManageAboutSettings').then((module) => ({ default: module.ManageAboutSettings })));
const IpLogManagement = lazy(() => import('../pages/seller/settings/IpLogManagement').then((module) => ({ default: module.IpLogManagement })));

export const sellerRoutes = (
  <>
    <Route index element={<SellerDashboard />} />
    <Route path="orders" element={<SellerOrders />} />
    <Route path="products" element={<ProductsList />} />
    <Route path="add-product" element={<AddEditProduct />} />
    <Route path="edit-product/:id" element={<AddEditProduct />} />
    <Route path="categories" element={<CategoriesList />} />
    <Route path="sliders" element={<SlidersList />} />
    <Route path="videos" element={<VideosList />} />
    <Route path="blogs" element={<SellerBlogs />} />
    <Route path="media-logos" element={<ManageProducts />} />
    <Route path="settings" element={<SiteSettings />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="change-password" element={<ChangePassword />} />
    <Route path="about-settings" element={<ManageAboutSettings />} />
    <Route path="ip-logs" element={<IpLogManagement />} />
  </>
);
