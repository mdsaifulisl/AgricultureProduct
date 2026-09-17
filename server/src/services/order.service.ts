import { Prisma, OrderStatus } from '@prisma/client';
import prisma from '../config/prisma.js'; // সেন্ট্রাল ইন্সট্যান্স ইমপোর্ট
import { CreateOrderInput } from '../validations/order.validation.js';
import { updateProductStockService } from './product.service.js';

// ১. Create Order Service
export const createOrderService = async (payload: CreateOrderInput) => {
  const { items, ...orderData } = payload;

  // 🔴 Step 0: Input Validation Guard Rules
  if (!orderData.fullName || orderData.fullName.trim().length > 100) {
    throw new Error('Full Name is required and must not exceed 100 characters');
  }

  if (!orderData.phone || orderData.phone.trim().length > 20) {
    throw new Error('Phone number is required and must not exceed 20 characters');
  }

  if (!orderData.address || orderData.address.trim().length > 300) {
    throw new Error('Address is required and must not exceed 300 characters');
  }

  if (orderData.note && orderData.note.trim().length > 500) {
    throw new Error('Note must not exceed 500 characters');
  }

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 🟢 Step A: প্রতিটি প্রোডাক্টের স্টক আপডেট/কমিয়ে নেওয়া
    for (const item of items) {
      await updateProductStockService(item.id, item.quantity, tx);
    }

    // 🟢 Step B: অর্ডার ক্রিয়েট করা
    const createdOrder = await tx.order.create({
      data: {
        ...orderData,
        status: orderData.status ?? 'PENDING',
        seenName: orderData.seenName ?? 'unSeen',
        items: {
          create: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            unit: item.unit,
            baseAmount: item.baseAmount,
            sku: item.sku,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return createdOrder;
  });

  return result;
}; 

// ২. Get All Orders Service (Admin View)
export const getAllOrdersService = async () => {
  return await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// ৩. Get Order By ID Service
export const getOrderByIdService = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
};

// ৪. Mark Order as Seen Service
export const markOrderAsSeenService = async (id: string, adminName: string) => {
  return await prisma.order.update({
    where: { id },
    data: {
      seenName: adminName,
    },
    include: {
      items: true,
    },
  });
};

// ৫. Update Order Status Service
export const updateOrderStatusService = async (id: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: { id },
    data: {
      status,
    },
    include: {
      items: true,
    },
  });
};

// ৬. Delete Order Service
export const deleteOrderService = async (id: string) => {
  return await prisma.order.delete({
    where: { id },
  });
};










