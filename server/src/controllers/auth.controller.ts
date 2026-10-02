import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

// Cookie Options Setup
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.loginUser(email, password);
      
      // HTTP-Only Cookie তে accessToken বা refreshToken সেট করা
      if (result?.accessToken) {
        res.cookie('accessToken', result.accessToken, cookieOptions);
      }

      res.status(200).json({
        success: true,
        message: 'লগইন সফল হয়েছে',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      // Cookie Clear করার সময় একই options ব্যবহার করতে হয় (maxAge ছাড়া)
      res.clearCookie('accessToken', {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
      });

      res.status(200).json({
        success: true,
        message: 'সফলভাবে লগআউট হয়েছে',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const result = await AuthService.getMe(userId);

      res.status(200).json({
        success: true,
        message: 'ইউজার প্রোফাইল তথ্য সফলভাবে পাওয়া গেছে',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async sendForgotPasswordOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await AuthService.sendForgotPasswordOtp(email);

      res.status(200).json({
        success: true,
        message: 'আপনার ইমেইলে OTP কোড পাঠানো হয়েছে',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      await AuthService.verifyOtp(email, otp);

      res.status(200).json({
        success: true,
        message: 'OTP ভেরিফিকেশন সফল হয়েছে',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      await AuthService.resetPasswordWithOtp(email, otp, newPassword);

      res.status(200).json({
        success: true,
        message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

//   async changePassword(req: Request, res: Response) {
//     try {
//       const { oldPassword, newPassword } = req.body;
//       const userId = (req as any).user?.id;
//       await AuthService.changePassword(userId, oldPassword, newPassword);

//       res.status(200).json({
//         success: true,
//         message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে',
//       });
//     } catch (error: any) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }, 
};


