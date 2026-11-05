import { Router, Request, Response, NextFunction } from 'express';
import {
  getAboutHandler,
  updateAboutHandler,
} from '../controllers/about.controller.js';
import { validate } from '../middlewares/validate.js';
import { updateAboutSchema } from '../validations/about.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

const setAboutFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'about';
  next();
};

// ----------------------------------------------------------------------
// 🌐 PUBLIC ROUTES:
// ----------------------------------------------------------------------
router.get('/', getAboutHandler);

// ----------------------------------------------------------------------
// 🔐 PROTECTED ROUTES:
// ----------------------------------------------------------------------

// ১. About Section আপডেট করা (ADMIN & MODERATOR)
router.put(
  '/',
  auth('ADMIN', 'MODERATOR'),
  setAboutFolder,
  upload.array('images', 1),
  validate(updateAboutSchema),
  compressAndSaveImages,
  updateAboutHandler
);

export default router;

