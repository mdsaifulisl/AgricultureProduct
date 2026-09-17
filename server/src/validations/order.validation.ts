import { z } from 'zod';

export const OrderStatusEnum = z.enum([
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]);

const cartItemSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  image: z.string().min(1, 'Product image is required'),
  unit: z.string().optional(),
  baseAmount: z.number().optional(),
  sku: z.string().optional(),
  quantity: z.number().positive('Quantity must be greater than zero'),
});

export const createOrderSchema = z.object({
  body: z.object({
    trackingId: z.string().min(1, 'Tracking ID is required'),
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(11, 'Phone number must be at least 11 digits'),
    address: z.string().min(1, 'Address is required'),
    note: z.string().optional(),
    paymentMethod: z.string().default('COD'),
    deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
    totalAmount: z.number().positive('Total amount must be positive'),
    status: OrderStatusEnum.default('PENDING'),
    seenName: z.string().default('unSeen'),
    items: z.array(cartItemSchema).min(1, 'Order must contain at least one item'),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Order ID format'),
  }),
  body: z.object({
    status: OrderStatusEnum,
  }),
});

export const markOrderSeenSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Order ID format'),
  }),
  body: z.object({
    adminName: z.string().min(1, 'Admin name is required'),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type MarkOrderSeenInput = z.infer<typeof markOrderSeenSchema>;