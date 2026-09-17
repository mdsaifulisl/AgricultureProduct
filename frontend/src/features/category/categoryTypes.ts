export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  image: string;
  description: string;
  badge?: string;
}

export interface UpdateCategoryPayload {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  badge?: string;
}