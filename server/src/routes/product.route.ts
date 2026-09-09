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

const router = Router();

// আপলোড ফোল্ডার নাম সেট করার কাস্টম মিডলওয়্যার
const setProductFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'products';
  next();
};

router
  .route('/')
  .post(
    setProductFolder,
    upload.array('images', 5), // সর্বোচ্চ ৫টি ছবি আপলোড নেওয়ার জন্য
    compressAndSaveImages,
    validate(createProductSchema),
    createProductHandler
  )
  .get(getProductsHandler);

router
  .route('/:id')
  .get(getProductByIdHandler)
  .patch(
    setProductFolder,
    upload.array('images', 5),
    compressAndSaveImages,
    validate(updateProductSchema),
    updateProductHandler
  )
  .delete(deleteProductHandler);

export default router;


