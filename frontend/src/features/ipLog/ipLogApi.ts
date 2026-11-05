import axiosInstance from '../../api/axiosInstance';
import type {
  ApiResponse,
  IpLogData,
  ToggleBlockIpPayload,
} from './ipLogTypes';

// সকল IP Log আনার জন্য API
export const fetchAllIpsApi = async (): Promise<ApiResponse<IpLogData[]>> => {
  const response = await axiosInstance.get<ApiResponse<IpLogData[]>>('/iplog');
  return response.data;
};

// IP ব্লক বা আনব্লক (Toggle) করার API
export const toggleBlockIpApi = async (
  payload: ToggleBlockIpPayload
): Promise<ApiResponse<IpLogData>> => {
  const response = await axiosInstance.patch<ApiResponse<IpLogData>>(
    '/iplog/toggle-block',
    payload
  );
  return response.data;
};