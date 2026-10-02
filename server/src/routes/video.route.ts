import { Router } from 'express';
import { VideoController } from '../controllers/video.controller.js';
import { VideoValidation } from '../validations/video.validation.js';
import { validate } from '../middlewares/validate.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router
  .route('/')
  .post(
    auth('admin', 'moderator'),
    validate(VideoValidation.createVideoSchema),
    VideoController.createVideo
  )
  .get(VideoController.getAllVideos);

router
  .route('/:id')
  .get(VideoController.getVideoById)
  .patch(
    auth('admin', 'moderator'),
    validate(VideoValidation.updateVideoSchema),
    VideoController.updateVideo
  )
  .delete(auth('admin', 'moderator'), VideoController.deleteVideo);

export default router;