/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductState } from './productTypes';
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from './productApi';

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  isError: false,
  error: null,
};

// Helper: ব্যাকএন্ড (Zod/Express) থেকে এরর বা ভ্যালিডেশন মেসেজ বের করার ফাংশন
const getErrorMessage = (error: any, defaultMsg: string): string => {
  const data = error.response?.data;

  if (data) {
    // Zod বা Express Validator-এর একাধিক এরর থাকলে অ্যারে থেকে স্ট্রিং করা
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
        .map((err: any) => {
          if (typeof err === 'string') return err;
          return err.message || err.msg || JSON.stringify(err);
        })
        .join(', ');
    }

    if (data.message && data.message !== 'Validation failed') {
      return data.message;
    }

    if (data.error) {
      return typeof data.error === 'string'
        ? data.error
        : JSON.stringify(data.error);
    }
  }

  return error.message || defaultMsg;
};

export const getProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'product/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProductsApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch products'));
    }
  }
);

export const addProduct = createAsyncThunk<Product, FormData | Partial<Product>, { rejectValue: string }>(
  'product/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await createProductApi(productData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create product'));
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; data: FormData | Partial<Product> },
  { rejectValue: string }
>('product/updateProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateProductApi(id, data);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update product'));
  }
});

export const removeProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  'product/removeProduct',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete product'));
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearProductError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Something went wrong';
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Failed to create product';
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        const index = state.products.findIndex((p) => (p.id || (p as any)._id) === (action.payload.id || (action.payload as any)._id));
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Failed to update product';
      })

      // Remove Product
      .addCase(removeProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.products = state.products.filter((p) => (p.id || (p as any)._id) !== action.payload);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Failed to delete product';
      });
  },
});

export const { setSelectedProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;