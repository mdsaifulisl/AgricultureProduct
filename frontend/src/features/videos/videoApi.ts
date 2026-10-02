import axiosInstance from '../../api/axiosInstance';
import type {
  Video,
  CreateVideoPayload,
  UpdateVideoPayload,
  ApiResponse,
} from './videoTypes';

export const getAllVideosApi = async (
  searchTerm?: string
): Promise<ApiResponse<Video[]>> => {
  const response = await axiosInstance.get<ApiResponse<Video[]>>('/videos', {
    params: searchTerm ? { searchTerm } : {},
  });
  return response.data;
};

export const getVideoByIdApi = async (
  id: string
): Promise<ApiResponse<Video>> => {
  const response = await axiosInstance.get<ApiResponse<Video>>(`/videos/${id}`);
  return response.data;
};

export const createVideoApi = async (
  payload: CreateVideoPayload
): Promise<ApiResponse<Video>> => {
  const response = await axiosInstance.post<ApiResponse<Video>>('/videos', payload);
  return response.data;
};

export const updateVideoApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateVideoPayload;
}): Promise<ApiResponse<Video>> => {
  const response = await axiosInstance.patch<ApiResponse<Video>>(`/videos/${id}`, data);
  return response.data;
};

export const deleteVideoApi = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/videos/${id}`);
  return response.data;
};