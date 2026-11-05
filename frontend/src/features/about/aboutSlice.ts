/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchAboutApi, updateAboutApi } from './aboutApi';
import type { AboutData, AboutState, UpdateAboutPayload } from './aboutTypes';

const initialState: AboutState = {
  aboutData: null,
  isLoading: false,
  isError: false,
  error: null,
};

// Async Thunk: About Data আনার জন্য
export const fetchAboutData = createAsyncThunk<
  AboutData,
  void,
  { rejectValue: string }
>('about/fetchAboutData', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAboutApi();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'About ডাটা লোড করতে ব্যর্থ হয়েছে'
    );
  }
});

// Async Thunk: About Data আপডেট করার জন্য
export const updateAboutSection = createAsyncThunk<
  AboutData,
  UpdateAboutPayload,
  { rejectValue: string }
>('about/updateAboutSection', async (payload, { rejectWithValue }) => {
  try {
    const response = await updateAboutApi(payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'About সেটিংস আপডেট করতে ব্যর্থ হয়েছে'
    );
  }
});

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearAboutError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch About Data
      .addCase(fetchAboutData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(
        fetchAboutData.fulfilled,
        (state, action: PayloadAction<AboutData>) => {
          state.isLoading = false;
          state.aboutData = action.payload;
        }
      )
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Failed to fetch about data';
      })

      // Update About Section
      .addCase(updateAboutSection.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(
        updateAboutSection.fulfilled,
        (state, action: PayloadAction<AboutData>) => {
          state.isLoading = false;
          state.aboutData = action.payload;
        }
      )
      .addCase(updateAboutSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Failed to update about section';
      });
  },
});

export const { clearAboutError } = aboutSlice.actions;
export default aboutSlice.reducer;