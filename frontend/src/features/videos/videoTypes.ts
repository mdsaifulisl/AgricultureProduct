export interface Video {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  category?: string;
  duration?: string;
  views?: string;
  featured?: boolean;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  youtubeId: string;
  category?: string;
  duration?: string;
  views?: string;
  featured?: boolean;
  status?: 'active' | 'inactive';
  createdAt?: string | Date;
}

export type UpdateVideoPayload = Partial<CreateVideoPayload>;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}