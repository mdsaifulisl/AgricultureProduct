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

const router = Router();

// ক্যাটাগরি ইমেজের জন্য আপলোড ফোল্ডার
const setCategoryFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'categories';
  next();
};

router
  .route('/')
  .post(
    setCategoryFolder,
    upload.array('image', 1), // multer memoryStorage
    compressAndSaveImages,   // Sharp দিয়ে ছবি ফাইলে সেভ করবে এবং req.body.images-এ URL বসাবে
    validate(createCategorySchema), // প্রসেস হওয়ার পর পাওয়া ফাইল URL ভ্যালিডেট করবে
    createCategoryHandler
  )
  .get(getCategoriesHandler);

router
  .route('/:id')
  .get(getCategoryByIdHandler)
  .patch(
    setCategoryFolder,
    upload.array('image', 1),
    compressAndSaveImages,
    validate(updateCategorySchema),
    updateCategoryHandler
  )
  .delete(deleteCategoryHandler);

export default router;