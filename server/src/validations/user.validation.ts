import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
    password: z.string().min(1, 'পাসওয়ার্ড দিন'),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'নাম আবশ্যক'),
    email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
    phone: z.string().optional(),
    role: z.enum(['admin', 'moderator', 'seller']).default('moderator'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('সঠিক ইমেইল ঠিকানা দিন').optional(),
    phone: z.string().optional(),
    role: z.enum(['admin', 'moderator', 'seller']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
    otp: z.string().length(6, 'OTP ৬ ডিজিটের হতে হবে'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
    otp: z.string().length(6, 'OTP ৬ ডিজিটের হতে হবে'),
    newPassword: z.string().min(6, 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে'),
  }),
});