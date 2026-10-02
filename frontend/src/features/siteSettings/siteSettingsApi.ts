import axiosInstance from '../../api/axiosInstance';
import type { ApiResponse, SiteSettings } from './siteSettingsTypes';

export const fetchSiteSettingsApi = async (): Promise<ApiResponse<SiteSettings>> => {
  const response = await axiosInstance.get<ApiResponse<SiteSettings>>('/site-settings');
  return response.data;
};

export const updateSiteSettingsApi = async (
  settingsData: FormData | Partial<SiteSettings>
): Promise<ApiResponse<SiteSettings>> => {
  const response = await axiosInstance.patch<ApiResponse<SiteSettings>>(
    '/site-settings',
    settingsData
  );
  return response.data;
};