/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface AboutData {
  id?: string;
  imageUrl?: string;
  badgeTitle: string;
  badgeSubtitle: string;
  tagline: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateAboutPayload {
  imageUrl?: string;
  badgeTitle: string;
  badgeSubtitle: string;
  tagline: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  images?: string[]; // ফাইল আপলোডের পর আসা লিংক রাখার জন্য (ঐচ্ছিক)
}

export interface AboutState {
  aboutData: AboutData | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}