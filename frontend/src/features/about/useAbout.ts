/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearAboutError,
  fetchAboutData,
  updateAboutSection,
} from './aboutSlice';
import type { UpdateAboutPayload } from './aboutTypes';

export const useAbout = () => {
  const dispatch = useAppDispatch();
  const { aboutData, isLoading, isError, error } = useAppSelector(
    (state) => (state as any).about
  );

  const getAboutData = useCallback(async () => {
    const resultAction = await dispatch(fetchAboutData());
    if (fetchAboutData.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(resultAction.payload || 'Failed to fetch about data');
    }
  }, [dispatch]);

  const handleUpdateAbout = useCallback(
    async (payload: UpdateAboutPayload) => {
      const resultAction = await dispatch(updateAboutSection(payload));
      if (updateAboutSection.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(
          (resultAction.payload as string) || 'Failed to update about section'
        );
      }
    },
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearAboutError()),
    [dispatch]
  );

  return useMemo(
    () => ({
      // State Values
      aboutData,
      isLoading,
      isError,
      error,

      // Action Handlers
      getAboutData,
      handleUpdateAbout,
      clearError,
    }),
    [
      aboutData,
      isLoading,
      isError,
      error,
      getAboutData,
      handleUpdateAbout,
      clearError,
    ]
  );
};