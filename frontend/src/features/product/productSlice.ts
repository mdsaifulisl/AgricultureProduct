/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
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

export const getProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'product/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProductsApi();
      return res.data; // ApiResponse-এর ভেতর থাকা data (যা আসল Product[])
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const addProduct = createAsyncThunk<Product, FormData | Partial<Product>, { rejectValue: string }>(
  'product/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await createProductApi(productData);
      return res.data; // ApiResponse-এর ভেতর থাকা data (যা আসল Product)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
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
    return res.data; // ApiResponse-এর ভেতর থাকা data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const removeProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  'product/removeProduct',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
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
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setSelectedProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;






