import { Router } from 'express';
import {
  createOrderController,
  getOrderByIdController,
  markOrderAsSeenController,
  updateOrderStatusController,
  deleteOrderController,
  getAllOrdersController,
  getOrderDashboardController,
} from '../controllers/order.controller.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  markOrderSeenSchema,
} from '../validations/order.validation.js';
import { auth } from '../middlewares/auth.js';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { createRateLimitStore } from '../config/rateLimitStore.js';

// Generic Zod Validation Middleware
const validate = (schema: any) => (req: any, res: any, next: any) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      errors: err.errors,
    });
  }
};

const router = Router();


// Create Order
const orderLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  store: createRateLimitStore('orders:'),
  // বৈধ device token থাকলে একই Wi-Fi-র গ্রাহকদের rate-limit আলাদা থাকবে।
  keyGenerator: (req) => req.body?.deviceFingerprint || ipKeyGenerator(req.ip || req.socket.remoteAddress || ''),
});
router.post('/', orderLimiter, validate(createOrderSchema), createOrderController);

// Delete Order
router.delete('/:id', auth('admin'), deleteOrderController);

router.use(auth('admin', 'moderator')); 
router.get('/dashboard', getOrderDashboardController);
// Get All Orders
router.get('/', getAllOrdersController);


// Get Single Order
router.get('/:id', getOrderByIdController);

// Mark Order as Seen By Admin
router.patch('/:id/seen', validate(markOrderSeenSchema), markOrderAsSeenController);

// Update Order Status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
router.patch('/:id/status', validate(updateOrderStatusSchema), updateOrderStatusController);



export default router;
