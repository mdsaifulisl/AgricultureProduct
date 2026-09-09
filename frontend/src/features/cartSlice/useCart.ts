// frontend/src/features/cart/useCart.ts
import { useAppDispatch, useAppSelector } from '../../app/hooks'; 
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from './cartSlice'; 
import type { CartItem } from '../../types/index';
  
export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  // ১. প্রোডাক্ট কার্টে যোগ করা
  const handleAddToCart = (
    product: Omit<CartItem, 'quantity'>,
    quantity: number = 1
  ) => {
    dispatch(addToCart({ product, quantity }));
  };

  // ২. প্রোডাক্টের কয়ান্টিটি বাড়ানো বা কমানো
  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  // ৩. নির্দিষ্ট প্রোডাক্ট কার্ট থেকে মুছে ফেলা
  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  // ৪. পুরো কার্ট খালি করা
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return {
    cartItems: items,
    totalQuantity,
    totalAmount,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
  };
};