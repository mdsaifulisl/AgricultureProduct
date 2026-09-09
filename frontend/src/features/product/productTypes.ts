export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating?: number;
  reviewsCount?: number;
  images: string[];
  description: string;
  shortDescription: string;
  metaDescription?: string;
  badge?: string;
  inStock?: boolean;
  stockCount: number;
  sku: string;
  isFeatured?: boolean;
  specifications?: Specification[];
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

