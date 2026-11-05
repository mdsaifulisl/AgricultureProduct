export interface IpLogData {
  id: string;
  ip: string;
  fullName: string | null;
  phone: string | null;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToggleBlockIpPayload {
  ip: string;
  isBlocked: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IpLogState {
  ipLogs: IpLogData[];
  isLoading: boolean;
  isUpdating: boolean;
  isError: boolean;
  error: string | null;
}