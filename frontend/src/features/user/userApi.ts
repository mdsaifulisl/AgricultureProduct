import axiosInstance from '../../api/axiosInstance';
import type {
  ApiResponse,
  CreateUserPayload,
  GetUsersQueryParams,
  UpdateUserPayload,
  User,
} from './userTypes';

export const fetchUsersApi = async (
  params?: GetUsersQueryParams
): Promise<ApiResponse<User[]>> => {
  const response = await axiosInstance.get<ApiResponse<User[]>>('/user', {
    params,
  });
  return response.data;
};

export const createUserApi = async (
  userData: CreateUserPayload
): Promise<ApiResponse<User>> => {
  const response = await axiosInstance.post<ApiResponse<User>>('/user', userData);
  return response.data;
};

export const updateUserApi = async (
  id: string,
  userData: UpdateUserPayload
): Promise<ApiResponse<User>> => {
  const response = await axiosInstance.patch<ApiResponse<User>>(`/user/${id}`, userData);
  return response.data;
};

export const deleteUserApi = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(`/user/${id}`);
  return response.data;
};