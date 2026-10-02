import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { authGuard } from '../middlewares/auth.middleware.js';
import { AuthValidation } from '../validations/auth.validation.js';

const router = Router();
 
router.post(
  '/login',
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
  validate(AuthValidation.sendOtpValidationSchema),
  AuthController.sendForgotPasswordOtp 
);

router.post(
  '/verify-otp',
  validate(AuthValidation.verifyOtpValidationSchema),
  AuthController.verifyOtp
);

router.post(
  '/reset-password',
  validate(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.post(
  '/logout',
  authGuard(),
  AuthController.logout
);

export const AuthRoutes = router;