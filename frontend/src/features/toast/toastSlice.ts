import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<{ message: string; type?: ToastType; id: string }>) => {
      state.toasts.push({
        id: action.payload.id,
        message: action.payload.message,
        type: action.payload.type || 'success',
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

// স্বয়ংক্রিয়ভাবে ৩ সেকেন্ড পর রিমুভ করার হেলপার অ্যাকশন
export const showToast = (message: string, type: ToastType = 'success') => {
  return (dispatch: (action: ReturnType<typeof addToast> | ReturnType<typeof removeToast>) => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    dispatch(addToast({ id, message, type }));

    setTimeout(() => {
      dispatch(removeToast(id));
    }, 3000);
  };
};

export default toastSlice.reducer;



