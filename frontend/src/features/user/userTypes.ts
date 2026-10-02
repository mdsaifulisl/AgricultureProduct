export type UserRole = 'admin' | 'moderator' | 'seller' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface GetUsersQueryParams {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}