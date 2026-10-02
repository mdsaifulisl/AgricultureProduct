import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchHeroSlides,
  fetchHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  toggleHeroSlideStatus,
  deleteHeroSlide,
  clearSelectedSlide,
} from './heroSlideSlice';
import type {
  CreateHeroSlidePayload,
  UpdateHeroSlidePayload,
} from './heroSlideTypes';

export const useSlider = () => {
  const dispatch = useAppDispatch();
  const { slides, selectedSlide, loading, error } = useAppSelector(
    (state) => state.heroSlide
  ); 

  const getSlides = useCallback(
    (search?: string) => {
      return dispatch(fetchHeroSlides(search));
    },
    [dispatch]
  );

  const getSlideById = useCallback(
    (id: string) => {
      return dispatch(fetchHeroSlideById(id));
    },
    [dispatch]
  );

  const addSlide = useCallback(
    (payload: CreateHeroSlidePayload | FormData) => {
      return dispatch(createHeroSlide(payload));
    },
    [dispatch]
  );

  const editSlide = useCallback(
    (id: string, data: UpdateHeroSlidePayload | FormData) => {
      return dispatch(updateHeroSlide({ id, data }));
    },
    [dispatch]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      return dispatch(toggleHeroSlideStatus(id));
    },
    [dispatch]
  );

  const removeSlide = useCallback(
    (id: string) => {
      return dispatch(deleteHeroSlide(id));
    },
    [dispatch]
  );

  const resetSelected = useCallback(() => {
    dispatch(clearSelectedSlide());
  }, [dispatch]);

  return {
    slides,
    selectedSlide,
    loading,
    error,
    getSlides,
    getSlideById,
    addSlide,
    editSlide,
    toggleStatus,
    removeSlide,
    resetSelected,
  };
};