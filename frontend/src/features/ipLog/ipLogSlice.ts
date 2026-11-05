/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllIpsApi, toggleBlockIpApi } from './ipLogApi';
import type {
  IpLogData,
  IpLogState,
  ToggleBlockIpPayload,
} from './ipLogTypes';

const initialState: IpLogState = {
  ipLogs: [],
  isLoading: false,
  isUpdating: false,
  isError: false,
  error: null,
};

// সকল IP আনার থাঙ্ক
export const fetchAllIps = createAsyncThunk<
  IpLogData[],
  void,
  { rejectValue: string }
>('ipLog/fetchAllIps', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAllIpsApi();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch IP logs'
    );
  }
});

// IP ব্লক/আনব্লক করার থাঙ্ক
export const toggleBlockIp = createAsyncThunk<
  IpLogData,
  ToggleBlockIpPayload,
  { rejectValue: string }
>('ipLog/toggleBlockIp', async (payload, { rejectWithValue }) => {
  try {
    const response = await toggleBlockIpApi(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update IP block status'
    );
  }
});

const ipLogSlice = createSlice({
  name: 'ipLog',
  initialState,
  reducers: {
    clearIpLogError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All IPs
      .addCase(fetchAllIps.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchAllIps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ipLogs = action.payload;
      })
      .addCase(fetchAllIps.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Failed to fetch IP logs';
      })

      // Toggle Block IP
      .addCase(toggleBlockIp.pending, (state) => {
        state.isUpdating = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(toggleBlockIp.fulfilled, (state, action) => {
        state.isUpdating = false;
        // স্টেট-এ সংশ্লিষ্ট IP এর স্ট্যাটাস আপডেট করে দেওয়া হলো
        const index = state.ipLogs.findIndex(
          (item) => item.ip === action.payload.ip
        );
        if (index !== -1) {
          state.ipLogs[index] = action.payload;
        } else {
          state.ipLogs.unshift(action.payload);
        }
      })
      .addCase(toggleBlockIp.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.error = action.payload || 'Failed to toggle IP status';
      });
  },
});

export const { clearIpLogError } = ipLogSlice.actions;
export default ipLogSlice.reducer;