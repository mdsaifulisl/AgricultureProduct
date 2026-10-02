import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks'; // আপনার প্রজেক্টের টাইপড হুক
import {
  fetchVideos,
  fetchVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  clearSelectedVideo,
  clearVideoError,
} from './videoSlice';
import type { CreateVideoPayload, UpdateVideoPayload } from './videoTypes';

export const useVideos = () => {
  const dispatch = useAppDispatch();
  const { videos, selectedVideo, loading, error } = useAppSelector(
    (state) => state.videos
  );

  const getVideos = useCallback(
    (searchTerm?: string) => {
      return dispatch(fetchVideos(searchTerm));
    },
    [dispatch]
  );

  const getVideoById = useCallback(
    (id: string) => {
      return dispatch(fetchVideoById(id));
    },
    [dispatch]
  );

  const handleCreateVideo = useCallback(
    (payload: CreateVideoPayload) => {
      return dispatch(createVideo(payload));
    },
    [dispatch]
  );

  const handleUpdateVideo = useCallback(
    (id: string, data: UpdateVideoPayload) => {
      return dispatch(updateVideo({ id, data }));
    },
    [dispatch]
  );

  const handleDeleteVideo = useCallback(
    (id: string) => {
      return dispatch(deleteVideo(id));
    },
    [dispatch]
  );

  const handleClearSelectedVideo = useCallback(() => {
    dispatch(clearSelectedVideo());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearVideoError());
  }, [dispatch]);

  return {
    videos,
    selectedVideo,
    loading,
    error,
    getVideos,
    getVideoById,
    createVideo: handleCreateVideo,
    updateVideo: handleUpdateVideo,
    deleteVideo: handleDeleteVideo,
    clearSelectedVideo: handleClearSelectedVideo,
    clearError: handleClearError,
  };
};