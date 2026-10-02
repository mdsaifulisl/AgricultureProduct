import axiosInstance from '../../api/axiosInstance';
import type { ApiResponse, Product } from './productTypes';

export const fetchProductsApi = async (): Promise<ApiResponse<Product[]>> => {
  const response = await axiosInstance.get<ApiResponse<Product[]>>('/product');
  return response.data;
};

export const fetchProductByIdApi = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await axiosInstance.get<ApiResponse<Product>>(`/product/${id}`);
  return response.data;
};

export const createProductApi = async (
  productData: FormData | Partial<Product>
): Promise<ApiResponse<Product>> => {
  const response = await axiosInstance.post<ApiResponse<Product>>('/product', productData);
  return response.data;
};

export const updateProductApi = async (
  id: string,
  productData: FormData | Partial<Product>
): Promise<ApiResponse<Product>> => {
  const response = await axiosInstance.patch<ApiResponse<Product>>(`/product/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id: string): Promise<ApiResponse<{ id: string }>> => {
  const response = await axiosInstance.delete<ApiResponse<{ id: string }>>(`/product/${id}`);
  return response.data;
};





