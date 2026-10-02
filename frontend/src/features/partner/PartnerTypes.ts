export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PartnerState {
  partners: Partner[];
  singlePartner: Partner | null;
  selectedPartnerId: string | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}