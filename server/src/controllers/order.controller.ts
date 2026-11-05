import { Request, Response } from 'express';
import {
  createOrderService,
  getOrderByIdService,
  markOrderAsSeenService,
  updateOrderStatusService,
  deleteOrderService,
  getOrdersPageService,
  getOrderDashboardService,
} from '../services/order.service.js';
import { getClientIp } from '../utils/getIp.js';


// Get All Orders Controller
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const parsePositive = (value: unknown, fallback: number) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
    };
    const page = parsePositive(req.query.page, 1);
    const limit = Math.min(parsePositive(req.query.limit, 50), 100);
    const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
    const rawStatus = typeof req.query.status === 'string' ? req.query.status : '';
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const status = validStatuses.includes(rawStatus) ? rawStatus as import('@prisma/client').OrderStatus : undefined;
    const result = await getOrdersPageService(page, limit, search, status);

    return res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error: any) {
      return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    });
  }
};

export const getOrderDashboardController = async (_req: Request, res: Response) => {
  try {
    const data = await getOrderDashboardService();
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'ড্যাশবোর্ডের অর্ডার তথ্য আনতে ব্যর্থ হয়েছে।' });
  }
};

// ১. Create Order Controller
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const clientIp = getClientIp(req); 
    
    // সার্ভিস ফাংশনে orderData এর সাথে clientIp পাস করা হলো
    const result = await createOrderService(orderData, clientIp);
    
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: result,
    });
  } catch (error: any) {
      return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to place order',
    });
  }
};

// ২. Get Order By ID Controller
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderId = Array.isArray(id) ? id[0] : id;
    const result = await getOrderByIdService(orderId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order',
    });
  }
};

// ৩. Mark Order as Seen Controller
export const markOrderAsSeenController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderId = Array.isArray(id) ? id[0] : id;
    const adminName = (req as any).user?.name || req.body.adminName;

    if (!adminName) {
      return res.status(400).json({
        success: false,
        message: 'Admin name is required',
      });
    }

    const result = await markOrderAsSeenService(orderId, adminName);

    return res.status(200).json({
      success: true,
      message: 'Order marked as seen',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark order as seen',
    });
  }
};

// ৪. Update Order Status Controller
export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderId = Array.isArray(id) ? id[0] : id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Order status is required',
      });
    }

    const result = await updateOrderStatusService(orderId, status);

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status',
    });
  }
};

// ৫. Delete Order Controller
export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderId = Array.isArray(id) ? id[0] : id;

    await deleteOrderService(orderId);

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete order',
    });
  }
};

