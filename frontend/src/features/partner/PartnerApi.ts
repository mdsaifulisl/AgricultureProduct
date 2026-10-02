/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../../api/axiosInstance';
import type { ApiResponse, Partner } from './PartnerTypes';

export const fetchPartnersApi = async (): Promise<ApiResponse<Partner[]>> => {
  const response = await axiosInstance.get<ApiResponse<Partner[]>>('/partner');
  return response.data;
};

export const fetchPartnerByIdApi = async (id: string): Promise<ApiResponse<Partner>> => {
  const response = await axiosInstance.get<ApiResponse<Partner>>(`/partner/${id}`);
  return response.data;
};

export const createPartnerApi = async (
  partnerData: FormData | Record<string, any>
): Promise<ApiResponse<Partner>> => {
  const response = await axiosInstance.post<ApiResponse<Partner>>('/partner', partnerData, {
    headers:
      partnerData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });
  return response.data;
};

export const updatePartnerApi = async (
  id: string,
  partnerData: FormData | Record<string, any>
): Promise<ApiResponse<Partner>> => {
  const response = await axiosInstance.patch<ApiResponse<Partner>>(`/partner/${id}`, partnerData, {
    headers:
      partnerData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });
  return response.data;
};

export const deletePartnerApi = async (id: string): Promise<ApiResponse<Partner>> => {
  const response = await axiosInstance.delete<ApiResponse<Partner>>(`/partner/${id}`);
  return response.data;
};