/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  HeroSlide,
  CreateHeroSlidePayload,
  UpdateHeroSlidePayload,
} from './heroSlideTypes';
import {
  getAllHeroSlidesApi,
  getHeroSlideByIdApi,
  createHeroSlideApi,
  updateHeroSlideApi,
  toggleHeroSlideStatusApi,
  deleteHeroSlideApi,
} from './heroSlideApi';

interface HeroSlideState {
  slides: HeroSlide[];
  selectedSlide: HeroSlide | null;
  loading: boolean;
  error: string | null;
}

const initialState: HeroSlideState = {
  slides: [],
  selectedSlide: null,
  loading: false,
  error: null,
};

export const fetchHeroSlides = createAsyncThunk(
  'heroSlide/fetchAll',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await getAllHeroSlidesApi(search);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch slides');
    }
  }
);

export const fetchHeroSlideById = createAsyncThunk(
  'heroSlide/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getHeroSlideByIdApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch slide');
    }
  }
);

export const createHeroSlide = createAsyncThunk(
  'heroSlide/create',
  async (payload: CreateHeroSlidePayload | FormData, { rejectWithValue }) => {
    try {
      const response = await createHeroSlideApi(payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create slide');
    }
  }
);

export const updateHeroSlide = createAsyncThunk(
  'heroSlide/update',
  async (
    { id, data }: { id: string; data: UpdateHeroSlidePayload | FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateHeroSlideApi({ id, data });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update slide');
    }
  }
);

export const toggleHeroSlideStatus = createAsyncThunk(
  'heroSlide/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await toggleHeroSlideStatusApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
    }
  }
);

export const deleteHeroSlide = createAsyncThunk(
  'heroSlide/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteHeroSlideApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete slide');
    }
  }
);

const heroSlideSlice = createSlice({
  name: 'heroSlide',
  initialState,
  reducers: {
    clearSelectedSlide: (state) => {
      state.selectedSlide = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload;
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Id
      .addCase(fetchHeroSlideById.fulfilled, (state, action) => {
        state.selectedSlide = action.payload;
      })
      // Create
      .addCase(createHeroSlide.fulfilled, (state, action) => {
        state.slides.unshift(action.payload);
      })
      // Update
      .addCase(updateHeroSlide.fulfilled, (state, action) => {
        const index = state.slides.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.slides[index] = action.payload;
        }
      })
      // Toggle Status
      .addCase(toggleHeroSlideStatus.fulfilled, (state, action) => {
        const index = state.slides.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.slides[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteHeroSlide.fulfilled, (state, action) => {
        state.slides = state.slides.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearSelectedSlide } = heroSlideSlice.actions;
export default heroSlideSlice.reducer;