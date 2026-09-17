import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  createOrder,
  fetchAllOrders,
  fetchOrderById,
  updateOrderStatus,
  markOrderAsSeen,
  deleteOrder,
  clearCurrentOrder,
  clearOrderError,
} from './orderSlice';
import type {
  CreateOrderPayload,
  OrderStatus,
} from './orderTypes';

export const useOrder = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, loading, error } = useAppSelector((state) => state.order);

  const handleFetchAllOrders = useCallback(async () => {
    return await dispatch(fetchAllOrders()).unwrap();
  }, [dispatch]);

  const handleCreateOrder = useCallback(
    async (payload: CreateOrderPayload) => {
      return await dispatch(createOrder(payload)).unwrap();
    },
    [dispatch]
  );

  const handleGetOrderById = useCallback(
    async (id: string) => {
      return await dispatch(fetchOrderById(id)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      return await dispatch(updateOrderStatus({ id, status })).unwrap();
    },
    [dispatch]
  );

  // Object-based wrapper for flexibility
  const handleUpdateOrderStatus = useCallback(
    async ({ id, status }: { id: string; status: OrderStatus }) => {
      return await dispatch(updateOrderStatus({ id, status })).unwrap();
    },
    [dispatch]
  );

  const handleMarkAsSeen = useCallback(
    async (id: string, adminName: string) => {
      return await dispatch(markOrderAsSeen({ id, adminName })).unwrap();
    },
    [dispatch]
  );

  const handleDeleteOrder = useCallback(
    async (id: string) => {
      return await dispatch(deleteOrder(id)).unwrap();
    },
    [dispatch]
  );

  const handleClearCurrentOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  return {
    orders,
    currentOrder,
    loading,
    isLoading: loading, // Aliased for component compatibility
    error,
    getAllOrders: handleFetchAllOrders,
    createOrder: handleCreateOrder,
    getOrderById: handleGetOrderById,
    updateStatus: handleUpdateStatus,
    updateOrderStatus: handleUpdateOrderStatus, // Dual support
    markAsSeen: handleMarkAsSeen,
    removeOrder: handleDeleteOrder,
    clearCurrentOrder: handleClearCurrentOrder,
    clearError: handleClearError,
  };
}; 