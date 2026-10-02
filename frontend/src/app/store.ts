import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cartSlice/cartSlice'; 
import toastReducer from '../features/toast/toastSlice';
import confirmReducer from '../features/confirm/confirmSlice';
import orderReducer from '../features/order/orderSlice';
import categoryReducer from '../features/category/categorySlice';
import heroSlideReducer from '../features/hero-slider/heroSlideSlice';
import videoReducer from '../features/videos/videoSlice';
import blogReducer from '../features/blog/blogSlice';
import likeReducer from '../features/like/likeSlice';
import partnerReducer from '../features/partner/PartnerSlice';
import siteSettingsReducer from '../features/siteSettings/siteSettingsSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
  reducer: {
    heroSlide: heroSlideReducer,
    product: productReducer,
    cart: cartReducer, 
    toast: toastReducer,
    confirm: confirmReducer,
    order: orderReducer,
    category: categoryReducer,
    videos: videoReducer,
    blog: blogReducer,
    likes: likeReducer,
    partner: partnerReducer,
    siteSettings: siteSettingsReducer,
    user: userReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;