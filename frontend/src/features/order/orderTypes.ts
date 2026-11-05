

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
  deviceFingerprint?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  deviceFingerprint: string;
  trackingId: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: string;
  shippingZone: 'dhaka' | 'outside';
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
  pagination: OrdersPageInfo;
}

export interface OrdersQuery { page?: number; limit?: number; search?: string; status?: string; }
export interface OrdersPageInfo { page: number; limit: number; total: number; totalPages: number; deviceOrderCounts: Record<string, number>; }
export interface OrdersDashboardData {
  stats: { totalOrders: number; pendingOrders: number; deliveredSales: number; statusCounts: Record<string, number> };
  recentOrders: Pick<Order, 'id' | 'fullName' | 'totalAmount' | 'status' | 'createdAt'>[];
  trends: { bucket: string; orderCount: number; sales: number }[];
}






