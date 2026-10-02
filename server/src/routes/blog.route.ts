import { Router, Request, Response, NextFunction } from 'express';
import {
  createBlogHandler,
  getBlogsHandler,
  getBlogByIdHandler,
  updateBlogHandler,
  deleteBlogHandler,
  addCommentHandler,
  likeBlogHandler,
  uploadEditorImageHandler,
  deleteBlogComment,
} from '../controllers/blog.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  addCommentSchema,
} from '../validations/blog.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js';

const router = Router();

const setBlogFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'blogs';
  next();
};

// ১. এডিটরের ভেতর থেকে ইমেজ আপলোড
router.post(
  '/upload-editor-image',
  setBlogFolder,
  upload.single('image'),
  compressAndSaveImages,
  uploadEditorImageHandler
);

// ২. ব্লগ ক্রিয়েট
router
  .route('/')
  .post(
    setBlogFolder,
    upload.single('image'), 
    validate(createBlogPostSchema), // <--- আগে Validation
    compressAndSaveImages,          // <--- Validation পাস করলে সেভ হবে
    createBlogHandler
  )
  .get(getBlogsHandler);

router
  .route('/:id')
  .get(getBlogByIdHandler)
  .patch(
    setBlogFolder,
    upload.single('image'),
    validate(updateBlogPostSchema), // <--- আগে Validation
    compressAndSaveImages,
    updateBlogHandler
  )
  .delete(deleteBlogHandler);

router.post(
  '/:id/comments',
  validate(addCommentSchema),
  addCommentHandler
);
router.delete('/comments/:commentId', deleteBlogComment);
router.patch('/:id/like', likeBlogHandler);

export default router;