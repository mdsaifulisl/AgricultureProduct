import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getSiteSettings,
  updateSiteSettings,
  clearSiteSettingsError,
} from './siteSettingsSlice';
import type { SiteSettings } from './siteSettingsTypes';

export const useSiteSettings = (autoFetch: boolean = false) => {
  const dispatch = useAppDispatch();
  const { settings, isLoading, isError, error } = useAppSelector(
    (state) => state.siteSettings
  );

  // Auto fetch control - dependency array পরিষ্কার রাখা হয়েছে
  useEffect(() => {
    if (autoFetch && !settings) {
      dispatch(getSiteSettings());
    }
  }, [autoFetch, dispatch, settings]);

  // useCallback ব্যবহার করার ফলে Component-এ রেন্ডার লুপ হবে না
  const fetchSettings = useCallback(async () => {
    return await dispatch(getSiteSettings()).unwrap();
  }, [dispatch]);

  const editSettings = useCallback(
    async (data: FormData | Partial<SiteSettings>) => {
      return await dispatch(updateSiteSettings(data)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearSiteSettingsError());
  }, [dispatch]);

  return {
    // State Values
    settings,
    isLoading,
    isError,
    error, 

    // Action Handlers
    fetchSettings,
    editSettings,
    clearError,
  };
};