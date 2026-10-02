

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  unit?: string;
  baseAmount?: number;
  sku?: string;
  quantity: number;
}

export interface Order {
  id: string;
  trackingId: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: string;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus; 
  seenName: string;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  trackingId: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: string;
  deliveryFee: number;
  totalAmount: number;
  status?: OrderStatus;
  seenName?: string;
  items: Omit<OrderItem, 'productId'>[];
}

export interface UpdateOrderStatusPayload {
  id: string;
  status: OrderStatus;
}

export interface MarkOrderSeenPayload {
  id: string;
  adminName: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}






