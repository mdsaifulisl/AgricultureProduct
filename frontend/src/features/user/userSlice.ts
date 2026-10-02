/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createUserApi,
  deleteUserApi,
  fetchUsersApi,
  updateUserApi,
} from './userApi';
import type {
  CreateUserPayload,
  GetUsersQueryParams,
  UpdateUserPayload,
  User,
  UserState,
} from './userTypes';

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  isError: false,
  error: null,
};

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (params: GetUsersQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await fetchUsersApi(params);
      return response.data || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'ইউজার তালিকা পেতে সমস্যা হয়েছে'
      );
    }
  }
);

export const addUser = createAsyncThunk(
  'user/addUser',
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await createUserApi(userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'ইউজার তৈরি করতে ব্যর্থ হয়েছে'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    { id, data }: { id: string; data: UpdateUserPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserApi(id, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'ইউজার তথ্য আপডেট করতে ব্যর্থ হয়েছে'
      );
    }
  }
);

export const removeUser = createAsyncThunk(
  'user/removeUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteUserApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'ইউজার ডিলিট করতে ব্যর্থ হয়েছে'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearUserError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })

      // Add User
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.users.unshift(action.payload);
        }
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.users.findIndex(
            (u) => u.id === action.payload?.id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(removeUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;