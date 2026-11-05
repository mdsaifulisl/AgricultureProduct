import axiosInstance from '../../api/axiosInstance';
import type { ApiResponse, AboutData, UpdateAboutPayload } from './aboutTypes';

// About Section ডাটা গেট করার API (Public Route)
export const fetchAboutApi = async (): Promise<ApiResponse<AboutData>> => {
  const response = await axiosInstance.get<ApiResponse<AboutData>>('/about');
  return response.data;
};

// About Section ডাটা আপডেট করার API (Protected Admin Route)
export const updateAboutApi = async (
  payload: UpdateAboutPayload
): Promise<ApiResponse<AboutData>> => {
  const response = await axiosInstance.put<ApiResponse<AboutData>>(
    '/about',
    payload
  );
  return response.data;
};