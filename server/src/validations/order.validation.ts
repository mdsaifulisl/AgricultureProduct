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
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name cannot exceed 100 characters'),
    phone: z
      .string()
      .min(11, 'Phone number must be at least 11 digits')
      .max(20, 'Phone number cannot exceed 20 characters'),
    address: z
      .string()
      .min(1, 'Address is required')
      .max(300, 'Address cannot exceed 300 characters'),
    note: z
      .string()
      .max(500, 'Note cannot exceed 500 characters')
      .optional(),
    paymentMethod: z.literal('COD').default('COD'),
    shippingZone: z.enum(['dhaka', 'outside']),
    deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
    totalAmount: z.number().positive('Total amount must be positive'),
    deviceFingerprint: z.string().regex(/^[a-f0-9]{64}$/i, 'ভুল ডিভাইস শনাক্তকরণ কোড').optional(),
    items: z.array(cartItemSchema.extend({ quantity: z.number().positive().max(100000) })).min(1, 'Order must contain at least one item').max(50),
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
