import { Router, Request, Response, NextFunction } from 'express';
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

// আপলোড ফোল্ডার সেট করার মিডলওয়্যার
const setCategoryFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'categories';
  next();
};

// ১. পাবলিক বা পাবলিক/অথ প্রটেক্টেড রাউটস
router
  .route('/')
  .post(
    auth('admin', 'moderator'),      // ১. অথোরাইজেশন আগে চেক করা ভালো
    setCategoryFolder,               // ২. আপলোড ফোল্ডার সেট
    upload.array('image', 1),        // ৩. ফাইল ও ফর্ম-ডাটা পার্সিং (req.body তৈরি করবে)
    validate(createCategorySchema),  // ৪. ফর্ম ডাটা ভ্যালিডেশন (req.body পার্স হওয়ার পর)
    compressAndSaveImages,           // ৫. ইমেজ কমপ্রেস ও সেভ
    createCategoryHandler            // ৬. হ্যান্ডলার
  )
  .get(getCategoriesHandler);

router
  .route('/:id')
  .get(getCategoryByIdHandler)
  .patch(
    auth('admin', 'moderator'),
    setCategoryFolder,
    upload.array('image', 1),
    validate(updateCategorySchema),
    compressAndSaveImages,
    updateCategoryHandler
  )
  .delete(
    auth('admin'), 
    deleteCategoryHandler
  );

export default router;