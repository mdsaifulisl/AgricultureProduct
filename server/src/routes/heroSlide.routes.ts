import { Router, Request, Response, NextFunction } from 'express';
import {
  createHeroSlideHandler,
  getHeroSlidesHandler,
  getHeroSlideByIdHandler,
  updateHeroSlideHandler,
  toggleHeroSlideStatusHandler,
  deleteHeroSlideHandler,
} from '../controllers/heroSlide.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createHeroSlideSchema,
  updateHeroSlideSchema,
} from '../validations/heroSlide.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

// আপলোড ফোল্ডার সেট করার জন্য মিডলওয়্যার
const setHeroFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'hero-slides';
  next();
};

router
  .route('/')
  .post(
    auth('admin', 'moderator'),
    setHeroFolder,
    upload.array('image', 1),
    validate(createHeroSlideSchema),
    compressAndSaveImages,
    createHeroSlideHandler
  )
  .get(getHeroSlidesHandler);

router
  .route('/:id')
  .get(getHeroSlideByIdHandler)
  .patch(
    auth('admin', 'moderator'),
    setHeroFolder,
    upload.array('image', 1),
    validate(updateHeroSlideSchema),
    compressAndSaveImages,
    updateHeroSlideHandler
  )
  .delete( auth('admin', 'moderator'), deleteHeroSlideHandler);

router.patch('/:id/toggle-status', auth('admin', 'moderator'), toggleHeroSlideStatusHandler);

export default router;