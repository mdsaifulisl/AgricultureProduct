import { Router, Request, Response, NextFunction } from 'express';
import {
  createPartnerHandler,
  getPartnersHandler,
  getPartnerByIdHandler,
  updatePartnerHandler,
  deletePartnerHandler,
} from '../controllers/partner.controller.js';
import { validate } from '../middlewares/validate.js';
import { PartnerValidation } from '../validations/partner.validation.js';
import { upload, compressAndSaveImages } from '../middlewares/upload.middleware.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

const setPartnerFolder = (req: Request, res: Response, next: NextFunction) => {
  req.uploadFolder = 'partners';
  next();
};

router
  .route('/')
  .post(
    auth('admin', 'moderator'),
    setPartnerFolder,
    upload.array('logo', 1), // single এর জায়গায় array('logo', 1) দিন
    validate(PartnerValidation.createPartnerZodSchema),
    compressAndSaveImages,
    createPartnerHandler 
  )
  .get(getPartnersHandler);

router
  .route('/:id')
  .get(getPartnerByIdHandler)
  .patch(
    auth('admin', 'moderator'),
    setPartnerFolder,
    upload.array('logo', 1), // single এর জায়গায় array('logo', 1) দিন
    validate(PartnerValidation.updatePartnerZodSchema),
    compressAndSaveImages,
    updatePartnerHandler
  )
  .delete(auth('admin', 'moderator'), deletePartnerHandler);

export default router;