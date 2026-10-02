import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  loadLikedIdsFromStorage, 
  saveLikedIdsToStorage, 
  // toggleLikedIdInStorage 
} from '../../utils/likeStorage';

interface LikeState {
  likedIds: string[];
}

const initialState: LikeState = {
  likedIds: loadLikedIdsFromStorage(),
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // যেকোনো আইডি লাইক / আনলাইক (Toggle) করার জন্য
    toggleLikeId: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.likedIds.indexOf(id);

      if (index >= 0) {
        state.likedIds.splice(index, 1);
      } else {
        state.likedIds.push(id);
      }

      saveLikedIdsToStorage(state.likedIds);
    },

    // সম্পূর্ণ অ্যারে সেট করার জন্য (যদি সার্ভার থেকে কখনো ডাটা আসে)
    setLikedIds: (state, action: PayloadAction<string[]>) => {
      state.likedIds = action.payload;
      saveLikedIdsToStorage(action.payload);
    },

    // সব লাইক একসাথে ক্লিয়ার করার জন্য
    clearLikedIds: (state) => {
      state.likedIds = [];
      saveLikedIdsToStorage([]);
    },
  },
});

export const { toggleLikeId, setLikedIds, clearLikedIds } = likeSlice.actions;
export default likeSlice.reducer;