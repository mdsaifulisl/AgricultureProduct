import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { authGuard } from '../middlewares/auth.middleware.js';
import { AuthValidation } from '../validations/auth.validation.js';
import rateLimit from 'express-rate-limit';
import { createRateLimitStore } from '../config/rateLimitStore.js';

const router = Router();
const authActionLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, store: createRateLimitStore('auth:') });
 
router.post(
  '/login',
  authActionLimiter,
  validate(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.get(
  '/me',
  authGuard(),
  AuthController.getMe
);

router.post(
  '/forgot-password',
  authActionLimiter,
  validate(AuthValidation.sendOtpValidationSchema),
  AuthController.sendForgotPasswordOtp 
);

router.post(
  '/verify-otp',
  authActionLimiter,
  validate(AuthValidation.verifyOtpValidationSchema),
  AuthController.verifyOtp
);

router.post(
  '/reset-password',
  authActionLimiter,
  validate(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.post(
  '/logout',
  authGuard(),
  AuthController.logout
);

router.post(
  '/change-password',
  authGuard(),
  validate(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
