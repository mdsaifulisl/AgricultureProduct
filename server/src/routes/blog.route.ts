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
import { auth } from '../middlewares/auth.js';

const router = Router();

const setBlogFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'blogs';
  next();
};

// ----------------------------------------------------------------------
// 🌐 PUBLIC ROUTES:
// ----------------------------------------------------------------------
router.get('/', getBlogsHandler);
router.get('/:id', getBlogByIdHandler);
router.post('/:id/comments', validate(addCommentSchema), addCommentHandler);
router.patch('/:id/like', likeBlogHandler);

// ----------------------------------------------------------------------
// 🔐 PROTECTED ROUTES:
// ----------------------------------------------------------------------

// ১. এডিটরের ভেতর থেকে ইমেজ আপলোড (ADMIN, MODERATOR & WRITER)
router.post(
  '/upload-editor-image',
  auth('admin', 'moderator', 'writer'),
  setBlogFolder,
  upload.single('image'),
  compressAndSaveImages,
  uploadEditorImageHandler
);

// ২. ব্লগ ক্রিয়েট (ADMIN, MODERATOR & WRITER)
router.post(
  '/',
  auth('admin', 'moderator', 'writer'),
  setBlogFolder,
  upload.single('image'),
  validate(createBlogPostSchema), // <--- আগে Validation
  compressAndSaveImages,          // <--- Validation পাস করলে সেভ হবে
  createBlogHandler
);

// ৩. ব্লগ আপডেট (ADMIN, MODERATOR & WRITER)
router.patch(
  '/:id',
  auth('admin', 'moderator', 'writer'),
  setBlogFolder,
  upload.single('image'),
  validate(updateBlogPostSchema), // <--- আগে Validation
  compressAndSaveImages,
  updateBlogHandler
);

// ৪. ব্লগ ডিলিট (ADMIN & MODERATOR)
router.delete(
  '/:id',
  auth('admin', 'moderator'),
  deleteBlogHandler
);

// ৫. কমেন্ট ডিলিট (ADMIN & MODERATOR)
router.delete(
  '/comments/:commentId',
  auth('admin', 'moderator'),
  deleteBlogComment
);

export default router;