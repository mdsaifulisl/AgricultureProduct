import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks'; 
import { toggleLikeId, clearLikedIds } from './likeSlice'; 
import type { RootState } from '../../app/store';

export const useLike = () => {
  const dispatch = useAppDispatch();
  
  // Redux থেকে লাইক করা আইডিগুলোর অ্যারে নেওয়া
  const likedIds = useAppSelector((state: RootState) => state.likes.likedIds);

  /**
   * Toggle Like Logic:
   * আইডি রিডাক্সে থাকলে আনলাইক করবে, না থাকলে লাইক হিসেবে যোগ করবে
   */
  const toggleLike = useCallback(
    (id: string) => {
      dispatch(toggleLikeId(id));
    },
    [dispatch]
  );

  /**
   * নির্দিষ্ট কোনো ID লাইক করা আছে কিনা চেক করার জন্য
   */
  const isLiked = useCallback(
    (id: string) => {
      return likedIds.includes(id);
    },
    [likedIds]
  );

  return {
    likedIds,
    toggleLike,
    isLiked,
    clearAllLikes: () => dispatch(clearLikedIds()),
  };
};