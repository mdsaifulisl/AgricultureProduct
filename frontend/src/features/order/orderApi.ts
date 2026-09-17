import axiosInstance from '../../api/axiosInstance';
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  MarkOrderSeenPayload,
} from './orderTypes';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


export const getAllOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const response = await axiosInstance.get<ApiResponse<Order[]>>('/orders');
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



