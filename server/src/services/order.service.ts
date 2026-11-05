import { Prisma, OrderStatus } from '@prisma/client';
import prisma from '../config/prisma.js'; // সেন্ট্রাল ইন্সট্যান্স ইমপোর্ট
import { CreateOrderInput } from '../validations/order.validation.js';
import { updateProductStockService } from './product.service.js';
import { sendTelegramOrderNotification } from '../utils/sendTelegramNotification.js'; // 👈 ইমপোর্ট করুন
import { checkAndSaveIpService } from './ipLog.service.js';
// ১. Create Order Service (ipAddress সহ)
export const createOrderService = async (
  payload: CreateOrderInput,
  ipAddress?: string
) => {
  const fingerprint = payload.deviceFingerprint?.toLowerCase();
  if (fingerprint) {
    const device = await prisma.deviceBlock.findUnique({ where: { fingerprint } });
    // অর্ডার করার সময় fingerprint record তৈরি বা block করা হয় না; স্পষ্ট admin block থাকলেই আটকাবে।
    if (device?.isBlocked === true) {
      const error = new Error('এই ডিভাইস থেকে অর্ডার গ্রহণ করা যাচ্ছে না।') as Error & { statusCode: number };
      error.statusCode = 403;
      throw error;
    }
  }

  if (ipAddress) {
    await checkAndSaveIpService(ipAddress, {
      fullName: payload.fullName,
      phone: payload.phone,
    });;
  }
  
  const { items, ...orderData } = payload;

  // 🔴 Guard Rules
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
    const productIds = [...new Set(items.map((item) => item.id))];
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) throw new Error('কার্টে থাকা একটি বা একাধিক পণ্য আর পাওয়া যাচ্ছে না।');
    const productById = new Map(products.map((product) => [product.id, product]));
    const siteSettings = await tx.siteSetting.findFirst({ orderBy: { createdAt: 'asc' } });
    const deliveryFee = payload.shippingZone === 'dhaka'
      ? siteSettings?.insideDhakaDeliveryFee ?? 60
      : siteSettings?.outsideDhakaDeliveryFee ?? 120;
    const subtotal = items.reduce((sum, item) => {
      const product = productById.get(item.id)!;
      const match = product.unit.match(/^(\d+(?:\.\d+)?)/);
      const baseAmount = match ? Number(match[1]) : 1;
      return sum + (product.price / (baseAmount > 0 ? baseAmount : 1)) * item.quantity;
    }, 0);

    // Step A: প্রোডাক্টের স্টক কমানো
    for (const item of items) {
      await updateProductStockService(item.id, item.quantity, tx);
    }

    // Step B: অর্ডার তৈরি করা
    const createdOrder = await tx.order.create({
      data: {
        ...orderData,
        shippingZone: orderData.shippingZone,
        deliveryFee,
        totalAmount: Math.round(subtotal) + deliveryFee,
        ipAddress: ipAddress || null,
        deviceFingerprint: fingerprint || null,
        status: 'PENDING',
        seenName: 'unSeen',
        items: {
          create: items.map((item) => ({
            productId: item.id,
            name: productById.get(item.id)!.name,
            price: productById.get(item.id)!.price,
            image: productById.get(item.id)!.images[0] || '',
            unit: productById.get(item.id)!.unit,
            baseAmount: (() => { const match = productById.get(item.id)!.unit.match(/^(\d+(?:\.\d+)?)/); return match ? Number(match[1]) : 1; })(),
            sku: productById.get(item.id)!.sku,
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

  // 🟢 Step C: ব্যাকগ্রাউন্ডে টেলিগ্রাম নোটিফিকেশন পাঠানো (Async Fire & Forget)
  sendTelegramOrderNotification({
    trackingId: result.trackingId,
    fullName: result.fullName,
    phone: result.phone,
    address: result.address,
    note: result.note,
    totalAmount: result.totalAmount,
    deliveryFee: result.deliveryFee,
    paymentMethod: result.paymentMethod,
    items: result.items,
  });

  return result;
};

// ২. Get All Orders Service (Admin View)
export const getOrdersPageService = async (page: number, limit: number, search: string, status?: OrderStatus) => {
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(search ? { OR: [
      { id: { contains: search, mode: 'insensitive' } },
      { trackingId: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { ipAddress: { contains: search } },
      { deviceFingerprint: { contains: search, mode: 'insensitive' } },
    ] } : {}),
  };
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.order.count({ where }),
  ]);
  const fingerprints = [...new Set(orders.map((order) => order.deviceFingerprint).filter((value): value is string => Boolean(value)))];
  const grouped = fingerprints.length ? await prisma.order.groupBy({
    by: ['deviceFingerprint'], where: { deviceFingerprint: { in: fingerprints } }, _count: { _all: true },
  }) : [];
  const deviceOrderCounts = Object.fromEntries(grouped.flatMap((row) => row.deviceFingerprint ? [[row.deviceFingerprint, row._count._all] as const] : []));
  return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), deviceOrderCounts } };
};

export const getOrderDashboardService = async () => {
  const [totalOrders, pendingOrders, delivered, statusGroups, recentOrders, trends] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { totalAmount: true } }),
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.order.findMany({ take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, totalAmount: true, status: true, createdAt: true } }),
    prisma.$queryRaw<{ bucket: Date; orderCount: number; sales: number }[]>`
      SELECT DATE_TRUNC('day', "createdAt") AS bucket,
             COUNT(*)::int AS "orderCount",
             COALESCE(SUM("totalAmount"), 0)::float AS sales
      FROM "orders"
      WHERE "createdAt" >= NOW() - INTERVAL '1 year'
      GROUP BY 1 ORDER BY 1
    `,
  ]);
  return {
    stats: {
      totalOrders,
      pendingOrders,
      deliveredSales: delivered._sum.totalAmount || 0,
      statusCounts: Object.fromEntries(statusGroups.map((item) => [item.status, item._count._all])),
    },
    recentOrders,
    trends,
  };
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
