
import { Route } from 'react-router-dom';
import { SellerDashboard } from '../pages/seller/dashboard/SellerDashboard';
import ProductsList from '../pages/seller/products/ProductsList';
import AddEditProduct from '../pages/seller/products/AddEditProduct';
import { SellerOrders } from '../pages/seller/order/Orders';
import { CategoriesList } from '../pages/seller/categories/CategoriesList';
import { SlidersList } from '../pages/seller/sliders/SlidersList';
import { VideosList } from '../pages/seller/videos/VideosList';
import ManageProducts from '../pages/seller/partners_logo/ManagePartners';
import { SellerBlogs } from '../pages/seller/blog/SellerBlogs';
import SiteSettings from '../pages/seller/settings/SiteSettings';
import UserManagement from '../pages/seller/settings/UserManagement';
import ChangePassword from '../pages/seller/settings/ChangePassword';

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
  </>
);