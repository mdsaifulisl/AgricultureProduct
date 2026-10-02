import axiosInstance from '../../api/axiosInstance';
import type {
  ApiResponse,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponseData,
  ResetPasswordPayload,
  User,
  VerifyOtpPayload,
  // changePasswordPayload,
} from './authTypes';

export const loginUserApi = async (
  payload: LoginPayload
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponseData>>(
    '/auth/login',
    payload
  );
  console.log(response.data);
  return response.data;
   
};

export const fetchMeApi = async (): Promise<ApiResponse<User>> => {
  const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
  return response.data;
};

export const forgotPasswordApi = async (
  payload: ForgotPasswordPayload
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>('/auth/forgot-password', payload);
  return response.data;
};

export const verifyOtpApi = async (
  payload: VerifyOtpPayload
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>('/auth/verify-otp', payload);
  return response.data;
};

export const resetPasswordApi = async (
  payload: ResetPasswordPayload
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>('/auth/reset-password', payload);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>('/auth/logout');
  return response.data;
};

export const changePasswordApi = async (): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>('/auth/change-password');
  return response.data;
};