import { Request, Response } from 'express';
import {
  createOrderService,
  getOrderByIdService,
  markOrderAsSeenService,
  updateOrderStatusService,
  deleteOrderService,
  getAllOrdersService,
} from '../services/order.service.js';



// Get All Orders Controller
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllOrdersService();

    return res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    });
  }
};

// ১. Create Order Controller
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const result = await createOrderService(orderData);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
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