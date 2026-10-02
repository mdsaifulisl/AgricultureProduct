import axiosInstance from '../../api/axiosInstance';
import type {
  HeroSlide,
  CreateHeroSlidePayload,
  UpdateHeroSlidePayload,
} from './heroSlideTypes';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getAllHeroSlidesApi = async (search?: string): Promise<ApiResponse<HeroSlide[]>> => {
  const response = await axiosInstance.get<ApiResponse<HeroSlide[]>>('/hero-slides', {
    params: search ? { search } : undefined,
  });
  return response.data;
};

export const getHeroSlideByIdApi = async (id: string): Promise<ApiResponse<HeroSlide>> => {
  const response = await axiosInstance.get<ApiResponse<HeroSlide>>(`/hero-slides/${id}`);
  return response.data;
};

export const createHeroSlideApi = async (
  payload: CreateHeroSlidePayload | FormData
): Promise<ApiResponse<HeroSlide>> => {
  const response = await axiosInstance.post<ApiResponse<HeroSlide>>('/hero-slides', payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateHeroSlideApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateHeroSlidePayload | FormData;
}): Promise<ApiResponse<HeroSlide>> => {
  const response = await axiosInstance.patch<ApiResponse<HeroSlide>>(`/hero-slides/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const toggleHeroSlideStatusApi = async (id: string): Promise<ApiResponse<HeroSlide>> => {
  const response = await axiosInstance.patch<ApiResponse<HeroSlide>>(`/hero-slides/${id}/toggle-status`);
  return response.data;
};

export const deleteHeroSlideApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/hero-slides/${id}`);
  return response.data;
};