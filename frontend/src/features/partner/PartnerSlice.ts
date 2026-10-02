/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PartnerState, Partner } from './PartnerTypes';
import {
  fetchPartnersApi,
  fetchPartnerByIdApi,
  createPartnerApi,
  updatePartnerApi,
  deletePartnerApi,
} from './PartnerApi';

const initialState: PartnerState = {
  partners: [],
  singlePartner: null,
  selectedPartnerId: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchPartners = createAsyncThunk(
  'partner/fetchPartners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPartnersApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch partners'
      );
    }
  }
);

export const fetchPartnerById = createAsyncThunk(
  'partner/fetchPartnerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchPartnerByIdApi(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch partner'
      );
    }
  }
);

export const createPartner = createAsyncThunk(
  'partner/createPartner',
  async (partnerData: FormData | Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await createPartnerApi(partnerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create partner'
      );
    }
  }
);

export const updatePartner = createAsyncThunk(
  'partner/updatePartner',
  async (
    { id, partnerData }: { id: string; partnerData: FormData | Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await updatePartnerApi(id, partnerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update partner'
      );
    }
  }
);

export const deletePartner = createAsyncThunk(
  'partner/deletePartner',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deletePartnerApi(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete partner'
      );
    }
  }
);

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setSelectedPartnerId: (state, action: PayloadAction<string | null>) => {
      state.selectedPartnerId = action.payload;
    },
    clearSinglePartner: (state) => {
      state.singlePartner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Partners
      .addCase(fetchPartners.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.isLoading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Fetch Partner By Id
      .addCase(fetchPartnerById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.isLoading = false;
        state.singlePartner = action.payload;
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Create Partner
      .addCase(createPartner.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(createPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.isLoading = false;
        state.partners.unshift(action.payload);
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Update Partner
      .addCase(updatePartner.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updatePartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.isLoading = false;
        const index = state.partners.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.partners[index] = action.payload;
        }
        if (state.singlePartner?.id === action.payload.id) {
          state.singlePartner = action.payload;
        }
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Delete Partner
      .addCase(deletePartner.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(deletePartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.isLoading = false;
        state.partners = state.partners.filter((p) => p.id !== action.payload.id);
        if (state.singlePartner?.id === action.payload.id) {
          state.singlePartner = null;
        }
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setSelectedPartnerId, clearSinglePartner } = partnerSlice.actions;
export default partnerSlice.reducer;