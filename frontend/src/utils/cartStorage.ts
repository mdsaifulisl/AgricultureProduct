import type { CartItem } from '../types/index.js';

const CART_KEY = 'app_shopping_cart'; 

export const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

export const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

  