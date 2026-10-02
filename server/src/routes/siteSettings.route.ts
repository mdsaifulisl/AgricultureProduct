import { Router, Request, Response, NextFunction } from 'express';
import {
  getSiteSettingsHandler,
  updateSiteSettingsHandler,
} from '../controllers/siteSettings.controller.js';
import { validate } from '../middlewares/validate.js';
import { updateSiteSettingsSchema } from '../validations/siteSettings.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

const setSettingsFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'settings';
  next();
};

router
  .route('/')
  .get(getSiteSettingsHandler)
  .patch(
    auth('admin', 'moderator'),
    setSettingsFolder,
    upload.fields([
      { name: 'siteLogo', maxCount: 1 },
      { name: 'siteFavicon', maxCount: 1 },
    ]),
    validate(updateSiteSettingsSchema),
    compressAndSaveImages,
    updateSiteSettingsHandler
  );

export default router;