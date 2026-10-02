/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSiteSettingsApi, updateSiteSettingsApi } from './siteSettingsApi';
import type { SiteSettings, SiteSettingsState } from './siteSettingsTypes';

const initialState: SiteSettingsState = {
  settings: null,
  isLoading: false,
  isError: false,
  error: null,
};

// Async Thunks
export const getSiteSettings = createAsyncThunk(
  'siteSettings/getSiteSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSiteSettingsApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch site settings'
      );
    }
  }
);

export const updateSiteSettings = createAsyncThunk(
  'siteSettings/updateSiteSettings',
  async (
    settingsData: FormData | Partial<SiteSettings>,
    { rejectWithValue }
  ) => {
    try {
      const response = await updateSiteSettingsApi(settingsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update site settings'
      );
    }
  }
);

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    clearSiteSettingsError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(getSiteSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getSiteSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(getSiteSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      // Update Settings
      .addCase(updateSiteSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      });
  },
});

export const { clearSiteSettingsError } = siteSettingsSlice.actions;
export default siteSettingsSlice.reducer;