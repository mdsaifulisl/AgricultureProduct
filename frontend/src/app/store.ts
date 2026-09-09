import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cartSlice/cartSlice'; 
import toastReducer from '../features/toast/toastSlice';
import confirmReducer from '../features/confirm/confirmSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer, 
    toast: toastReducer,
    confirm: confirmReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;