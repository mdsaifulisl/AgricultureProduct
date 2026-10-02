import { Router } from 'express';
import {
  createOrderController,
  getOrderByIdController,
  markOrderAsSeenController,
  updateOrderStatusController,
  deleteOrderController,
  getAllOrdersController,
} from '../controllers/order.controller.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  markOrderSeenSchema,
} from '../validations/order.validation.js';
import { auth } from '../middlewares/auth.js';

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
router.post('/', validate(createOrderSchema), createOrderController);

// Delete Order
router.delete('/:id', auth('admin'), deleteOrderController);

router.use(auth('admin', 'moderator')); 
// Get All Orders
router.get('/', getAllOrdersController);


// Get Single Order
router.get('/:id', getOrderByIdController);

// Mark Order as Seen By Admin
router.patch('/:id/seen', validate(markOrderSeenSchema), markOrderAsSeenController);

// Update Order Status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
router.patch('/:id/status', validate(updateOrderStatusSchema), updateOrderStatusController);



export default router;