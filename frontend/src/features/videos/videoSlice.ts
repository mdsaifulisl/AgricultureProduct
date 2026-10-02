/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Video, CreateVideoPayload, UpdateVideoPayload } from './videoTypes';
import {
  getAllVideosApi,
  getVideoByIdApi,
  createVideoApi,
  updateVideoApi,
  deleteVideoApi,
} from './videoApi';

interface VideoState {
  videos: Video[];
  selectedVideo: Video | null;
  loading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  selectedVideo: null,
  loading: false,
  error: null,
};

export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (searchTerm: string | undefined, { rejectWithValue }) => {
    try {
      const response = await getAllVideosApi(searchTerm);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'ভিডিও আনতে ব্যর্থ হয়েছে');
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getVideoByIdApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'ভিডিও পাওয়া যায়নি');
    }
  }
);

export const createVideo = createAsyncThunk(
  'videos/createVideo',
  async (payload: CreateVideoPayload, { rejectWithValue }) => {
    try {
      const response = await createVideoApi(payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'ভিডিও তৈরি করতে ব্যর্থ হয়েছে');
    }
  }
);

export const updateVideo = createAsyncThunk(
  'videos/updateVideo',
  async (
    { id, data }: { id: string; data: UpdateVideoPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateVideoApi({ id, data });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'ভিডিও আপডেট করতে ব্যর্থ হয়েছে');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'videos/deleteVideo',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteVideoApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'ভিডিও মুছতে ব্যর্থ হয়েছে');
    }
  }
);

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearSelectedVideo: (state) => {
      state.selectedVideo = null;
    },
    clearVideoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action: PayloadAction<Video[]>) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Video
      .addCase(fetchVideoById.fulfilled, (state, action: PayloadAction<Video>) => {
        state.selectedVideo = action.payload;
      })
      // Create Video
      .addCase(createVideo.fulfilled, (state, action: PayloadAction<Video>) => {
        state.videos.unshift(action.payload);
      })
      // Update Video
      .addCase(updateVideo.fulfilled, (state, action: PayloadAction<Video>) => {
        const index = state.videos.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.videos[index] = action.payload;
        }
        if (state.selectedVideo?.id === action.payload.id) {
          state.selectedVideo = action.payload;
        }
      })
      // Delete Video
      .addCase(deleteVideo.fulfilled, (state, action: PayloadAction<string>) => {
        state.videos = state.videos.filter((v) => v.id !== action.payload);
      });
  },
});

export const { clearSelectedVideo, clearVideoError } = videoSlice.actions;
export default videoSlice.reducer;