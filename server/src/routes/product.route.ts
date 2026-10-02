import { Router, Request, Response, NextFunction } from 'express';
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js'; 
import { auth } from '../middlewares/auth.js';

const router = Router();

const setProductFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'products';
  next();
};

// ----------------------------------------------------------------------
// 🌐 PUBLIC ROUTES: 
// ----------------------------------------------------------------------
router.get('/', getProductsHandler);
router.get('/:id', getProductByIdHandler);

// ----------------------------------------------------------------------
// 🔐 PROTECTED ROUTES: 
// ----------------------------------------------------------------------

// ১. প্রোডাক্ট তৈরি করা (ADMIN & MODERATOR)
router.post(
  '/',
  auth('ADMIN', 'MODERATOR'),
  setProductFolder,
  upload.array('images', 5), 
  validate(createProductSchema),
  compressAndSaveImages,
  createProductHandler
);

// ২. প্রোডাক্ট আপডেট করা (ADMIN & MODERATOR)
router.patch(
  '/:id',
  auth('ADMIN', 'MODERATOR'),
  setProductFolder,
  upload.array('images', 5),
  validate(updateProductSchema),
  compressAndSaveImages,
  updateProductHandler
);

// ৩. প্রোডাক্ট ডিলেট করা (শুধুমাত্র ADMIN)
router.delete(
  '/:id',
  auth('ADMIN'),
  deleteProductHandler
);

export default router;