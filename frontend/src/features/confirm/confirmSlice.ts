import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../../app/store';

 
interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolveCallback: ((value: boolean) => void) | null;
}

const initialState: ConfirmState = {
  isOpen: false,
  options: {
    title: 'নিশ্চিতকরণ',
    message: '',
    confirmText: 'হ্যাঁ, নিশ্চিত',
    cancelText: 'বাতিল',
    type: 'danger',
  },
  resolveCallback: null,
};

const confirmSlice = createSlice({
  name: 'confirm',
  initialState, 
  reducers: {
    openConfirm: (
      state,
      action: PayloadAction<{ options: ConfirmOptions; resolve: (value: boolean) => void }>
    ) => {
      state.isOpen = true;
      state.options = {
        title: action.payload.options.title || 'নিশ্চিতকরণ',
        message: action.payload.options.message,
        confirmText: action.payload.options.confirmText || 'হ্যাঁ, নিশ্চিত',
        cancelText: action.payload.options.cancelText || 'বাতিল',
        type: action.payload.options.type || 'danger',
      };
      state.resolveCallback = action.payload.resolve as unknown as null;
    },
    closeConfirm: (state) => {
      state.isOpen = false;
      state.resolveCallback = null;
    },
  },
});

export const { openConfirm, closeConfirm } = confirmSlice.actions;

// Promise ভিত্তিক হেলপার থাংক (Strictly Typed Dispatch)
export const confirm = (options: ConfirmOptions) => {
  return (dispatch: AppDispatch) => {
    return new Promise<boolean>((resolve) => {
      dispatch(openConfirm({ options, resolve }));
    });
  };
};

export default confirmSlice.reducer;