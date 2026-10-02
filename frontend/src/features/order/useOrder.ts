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
import type { CreateOrderPayload, OrderStatus } from './orderTypes';

export const useOrder = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, loading, error } = useAppSelector((state) => state.order);

  const handleFetchAllOrders = useCallback(() => {
    return dispatch(fetchAllOrders()).unwrap();
  }, [dispatch]);

  const handleCreateOrder = useCallback(
    (payload: CreateOrderPayload) => {
      return dispatch(createOrder(payload)).unwrap();
    },
    [dispatch]
  );

  const handleGetOrderById = useCallback(
    (id: string) => {
      return dispatch(fetchOrderById(id)).unwrap();
    },
    [dispatch]
  );

  // Core update status handler
  const handleUpdateStatus = useCallback(
    (id: string, status: OrderStatus) => {
      return dispatch(updateOrderStatus({ id, status })).unwrap();
    },
    [dispatch]
  );

  // Object-based variant referencing core handler
  const handleUpdateOrderStatus = useCallback(
    ({ id, status }: { id: string; status: OrderStatus }) => {
      return handleUpdateStatus(id, status);
    },
    [handleUpdateStatus]
  );

  const handleMarkAsSeen = useCallback(
    (id: string, adminName: string) => {
      return dispatch(markOrderAsSeen({ id, adminName })).unwrap();
    },
    [dispatch]
  );

  const handleDeleteOrder = useCallback(
    (id: string) => {
      return dispatch(deleteOrder(id)).unwrap();
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
    // State
    orders,
    currentOrder,
    loading,
    isLoading: loading,
    error,

    // Actions
    getAllOrders: handleFetchAllOrders,
    createOrder: handleCreateOrder,
    getOrderById: handleGetOrderById,
    updateStatus: handleUpdateStatus,
    updateOrderStatus: handleUpdateOrderStatus,
    markAsSeen: handleMarkAsSeen,
    removeOrder: handleDeleteOrder,
    clearCurrentOrder: handleClearCurrentOrder,
    clearError: handleClearError,
  };
};