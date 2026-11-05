import axiosInstance from '../../api/axiosInstance';
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  MarkOrderSeenPayload,
  OrdersQuery,
  OrdersPageInfo,
  OrdersDashboardData,
} from './orderTypes';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


export const getAllOrdersApi = async (params: OrdersQuery = {}): Promise<ApiResponse<Order[]> & { pagination: OrdersPageInfo }> => {
  const response = await axiosInstance.get<ApiResponse<Order[]> & { pagination: OrdersPageInfo }>('/orders', { params: { page: 1, limit: 50, ...params } });
  return response.data;
};

export const getOrderDashboardApi = async (): Promise<ApiResponse<OrdersDashboardData>> => {
  const response = await axiosInstance.get<ApiResponse<OrdersDashboardData>>('/orders/dashboard');
  return response.data;
};

export const createOrderApi = async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
  const response = await axiosInstance.post<ApiResponse<Order>>('/orders', payload);
  return response.data;
};

export const getOrderByIdApi = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatusApi = async ({
  id,
  status,
}: UpdateOrderStatusPayload): Promise<ApiResponse<Order>> => {
  const response = await axiosInstance.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
  return response.data;
};

export const markOrderAsSeenApi = async ({
  id,
  adminName,
}: MarkOrderSeenPayload): Promise<ApiResponse<Order>> => {
  const response = await axiosInstance.patch<ApiResponse<Order>>(`/orders/${id}/seen`, { adminName });
  return response.data;
};

export const deleteOrderApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/orders/${id}`);
  return response.data;
};



