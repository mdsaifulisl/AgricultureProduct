/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type {
  OrderState,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  MarkOrderSeenPayload,
  Order,
} from './orderTypes';
import {
  createOrderApi,
  getOrderByIdApi,
  updateOrderStatusApi,
  markOrderAsSeenApi,
  deleteOrderApi,
  getAllOrdersApi,
} from './orderApi';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Backend Validation & General Error Handler Helper
const extractErrorMessage = (error: any, fallbackMsg: string): string => {
  const resData = error.response?.data;

  // Handling Zod Issues/ErrorSources Array
  if (resData?.errorSources && Array.isArray(resData.errorSources) && resData.errorSources.length > 0) {
    return resData.errorSources.map((err: any) => `${err.path ? `${err.path}: ` : ''}${err.message}`).join(' | ');
  }

  if (resData?.errors && Array.isArray(resData.errors) && resData.errors.length > 0) {
    return resData.errors.map((err: any) => err.message || err.msg).join(' | ');
  }

  if (resData?.message) {
    return typeof resData.message === 'string' ? resData.message : JSON.stringify(resData.message);
  }

  return error.message || fallbackMsg;
};

// 1. Fetch All Orders
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOrdersApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch orders'));
    }
  }
);

// 2. Create Order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const response = await createOrderApi(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to place order'));
    }
  }
);

// 3. Fetch Order By ID
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getOrderByIdApi(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch order'));
    }
  }
);

// 4. Update Order Status
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async (payload: UpdateOrderStatusPayload, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatusApi(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update order status'));
    }
  }
);

// 5. Mark Order As Seen
export const markOrderAsSeen = createAsyncThunk(
  'order/markOrderAsSeen',
  async (payload: MarkOrderSeenPayload, { rejectWithValue }) => {
    try {
      const response = await markOrderAsSeenApi(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to mark order as seen'));
    }
  }
);

// 6. Delete Order
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteOrderApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete order'));
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Mark Order As Seen
      .addCase(markOrderAsSeen.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(markOrderAsSeen.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o.id !== action.payload);
        if (state.currentOrder?.id === action.payload) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;