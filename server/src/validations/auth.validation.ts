import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'ইমেইল আবশ্যক' }).email('সঠিক ইমেইল ফরম্যাট দিন'),
    password: z.string({ required_error: 'পাসওয়ার্ড আবশ্যক' }),
  }),
});

const sendOtpValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'ইমেইল আবশ্যক' }).email('সঠিক ইমেইল ফরম্যাট দিন'),
  }),
});

const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'ইমেইল আবশ্যক' }).email('সঠিক ইমেইল ফরম্যাট দিন'),
    otp: z.string({ required_error: 'OTP কোড আবশ্যক' }).length(6, 'OTP কোড ৬ ডিজিটের হতে হবে'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'ইমেইল আবশ্যক' }).email('সঠিক ইমেইল ফরম্যাট দিন'),
    otp: z.string({ required_error: 'OTP কোড আবশ্যক' }).length(6, 'OTP কোড ৬ ডিজিটের হতে হবে'),
    newPassword: z.string({ required_error: 'নতুন পাসওয়ার্ড আবশ্যক' }).min(6, 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে'),
  }),
});



export const AuthValidation = {
  loginValidationSchema,
  sendOtpValidationSchema,
  verifyOtpValidationSchema,
  resetPasswordValidationSchema,
};