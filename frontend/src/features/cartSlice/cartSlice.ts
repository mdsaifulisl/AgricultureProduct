import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '../../types/index.js';
import { loadCartFromStorage, saveCartToStorage } from '../../utils/cartStorage';

const initialItems = loadCartFromStorage();

// ২০০ গ্রাম বা যেকোনো পরিমাণের জন্য নির্ভুল টোটাল হিসাব করার হেলপার
const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      // ১. টোটাল কোয়ান্টিটি যোগ করা
      acc.totalQuantity = Number((acc.totalQuantity + item.quantity).toFixed(2));
      
      // ২. বেস অ্যামাউন্ট বা আপলোডকৃত পরিমাণ (যেমন: ২০০ গ্রামের ক্ষেত্রে ২০০, ১ কেজির ক্ষেত্রে ১০০০ বা ১)
      // যদি baseAmount না থাকে বা ০ হয়, তবে ডিফল্ট ১ ধরা হবে
      const baseAmount = item.baseAmount && item.baseAmount > 0 ? item.baseAmount : 1;
      
      // ৩. সঠিক হিসাব: (প্রোডাক্টের মূল দাম / আপলোডকৃত পরিমাণ) * কাস্টমারের সিলেক্ট করা পরিমাণ
      // যেমন: (২০ টাকা / ২০০ গ্রাম) * ৬০০ গ্রাম = ৬০ টাকা
      const itemTotalPrice = (item.price / baseAmount) * item.quantity;
      
      acc.totalAmount = Number((acc.totalAmount + itemTotalPrice).toFixed(2));
      return acc;
    },
    { totalQuantity: 0, totalAmount: 0 }
  );
};

const initialTotals = calculateTotals(initialItems);

const initialState: CartState = {
  items: initialItems,
  totalQuantity: initialTotals.totalQuantity,
  totalAmount: initialTotals.totalAmount,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ১. প্রোডাক্ট যোগ করা
    addToCart: (
      state,
      action: PayloadAction<{ product: Omit<CartItem, 'quantity'>; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = Number((existingItem.quantity + quantity).toFixed(2));
      } else {
        state.items.push({ ...product, quantity });
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      saveCartToStorage(state.items);
    },

    // ২. কোয়ান্টিটি আপডেট করা
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.quantity = Number(quantity.toFixed(2));
        }
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      saveCartToStorage(state.items);
    },

    // ৩. রিমুভ করা
    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      saveCartToStorage(state.items);
    },

    // ৪. পুরো কার্ট খালি করা
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


// এই স্লাইস টার ভিতরে initialState টা ব্যহহার পধ্যতি কি? 