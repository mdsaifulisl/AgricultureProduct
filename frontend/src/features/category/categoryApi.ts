import axiosInstance from '../../api/axiosInstance';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from './categoryTypes';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getAllCategoriesApi = async (): Promise<ApiResponse<Category[]>> => {
  const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
  return response.data;
};

export const getCategoryByIdApi = async (id: string): Promise<ApiResponse<Category>> => {
  const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`);
  return response.data;
};

export const createCategoryApi = async (
  payload: CreateCategoryPayload | FormData
): Promise<ApiResponse<Category>> => {
  const response = await axiosInstance.post<ApiResponse<Category>>('/categories', payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateCategoryApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateCategoryPayload | FormData;
}): Promise<ApiResponse<Category>> => {
  const response = await axiosInstance.patch<ApiResponse<Category>>(`/categories/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteCategoryApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/categories/${id}`);
  return response.data;
};