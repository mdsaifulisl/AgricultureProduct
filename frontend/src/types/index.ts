// ১. ইউজার রোল এবং টাইপ
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  location?: string; // জেলা
  createdAt?: string;
}

// ২. প্রোডাক্ট ইউনিট ও ইমেজ
export type Unit = 'KG' | 'GRAM' | 'PCS' | 'LITER';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

// ৩. প্রোডাক্ট ক্যাটাগরি ও মডেল
export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  parentId?: string | null;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  unit: Unit;
  stock: number;
  isOrganic: boolean;
  location: string;
  isActive: boolean;
  images: ProductImage[];
  category?: Category;
  rating?: number;
  totalReviews?: number;
}

// ৪. শপিং কার্ট আইটেম
export interface CartItem {
  product: Product;
  quantity: number;
}

// ৫. অর্ডার সংক্রান্ত টাইপস
export type DeliverySlot = 'MORNING' | 'AFTERNOON';
export type PaymentMethod = 'COD' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'PAID';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  deliverySlot: DeliverySlot;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingId?: string;
  createdAt: string;
}

// ৬. ফিল্টার স্টেট টাইপ
export interface ProductFilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  district: string;
  searchQuery: string;
  sortBy: 'popularity' | 'lowToHigh' | 'highToLow' | 'newest';
}