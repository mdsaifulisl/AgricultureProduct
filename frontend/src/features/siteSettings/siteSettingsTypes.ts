export interface SiteSettings {
  id?: string;
  siteLogo?: string;
  siteFavicon?: string;
  siteTitle: string;
  siteDescription?: string;
  metaKeywords?: string;
  contactPhone?: string;
  contactEmail?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface SiteSettingsState {
  settings: SiteSettings | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}