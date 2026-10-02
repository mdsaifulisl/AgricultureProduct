/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchMeApi,
  forgotPasswordApi,
  loginUserApi,
  resetPasswordApi,
  verifyOtpApi,
  logoutApi,
  // changePasswordApi
} from './authApi';
import type {
  AuthState,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from './authTypes';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, 
  isError: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'লগইন করতে ব্যর্থ হয়েছে'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      return response.message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'লগআউট করতে ব্যর্থ হয়েছে'
      );
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMeApi();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'ইউজার তথ্য পেতে ব্যর্থ হয়েছে'
      );
    }
  }
);

export const sendForgotPasswordOtp = createAsyncThunk(
  'auth/sendForgotPasswordOtp',
  async (payload: ForgotPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(payload);
      return response.message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'OTP পাঠাতে ব্যর্থ হয়েছে'
      );
    }
  }
);

export const verifyOtpCode = createAsyncThunk(
  'auth/verifyOtpCode',
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const response = await verifyOtpApi(payload);
      return response.message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'অবৈধ বা মেয়াদোত্তীর্ণ OTP'
      );
    }
  }
);

export const resetPasswordWithOtp = createAsyncThunk(
  'auth/resetPasswordWithOtp',
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(payload);
      return response.message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.accessToken || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })

      // Fetch Me
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload || null;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isError = true;
        state.error = action.payload as string;
      })

      // Forgot Password (isLoading বাদ দেওয়া হয়েছে যাতে UI Re-mount না হয়)
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.isError = false;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state) => {
        state.isError = false;
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.isError = true;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOtpCode.pending, (state) => {
        state.isError = false;
      })
      .addCase(verifyOtpCode.fulfilled, (state) => {
        state.isError = false;
      })
      .addCase(verifyOtpCode.rejected, (state, action) => {
        state.isError = true;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPasswordWithOtp.pending, (state) => {
        state.isError = false;
      })
      .addCase(resetPasswordWithOtp.fulfilled, (state) => {
        state.isError = false;
      })
      .addCase(resetPasswordWithOtp.rejected, (state, action) => {
        state.isError = true;
        state.error = action.payload as string;
      })

      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;