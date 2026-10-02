import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userEvents } from '../events/user.events.js';

const prisma = new PrismaClient();

export const AuthService = {
  // ১. লগইন
  async loginUser(email: string, pass: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('ইমেইল বা পাসওয়ার্ড সঠিক নয়');
    }

    if (user.status && user.status === 'inactive') {
      throw new Error('আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। কর্তৃপক্ষের সাথে যোগাযোগ করুন');
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatch) {
      throw new Error('ইমেইল বা পাসওয়ার্ড সঠিক নয়');
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '7d' }
    );

    const { password, resetOtp, resetOtpExpiresAt, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
    };
  },

  // ২. কারেন্ট ইউজার প্রোফাইল ( /auth/me )
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('ইউজার খুঁজে পাওয়া যায়নি');
    }

    return user;
  },

  // ৩. ফরগেট পাসওয়ার্ড OTP সেন্ড (Event-Driven / Non-blocking)
  async sendForgotPasswordOtp(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('ইমেইল ঠিকানাটি খুঁজে পাওয়া যায়নি');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ১. ডাটাবেজে OTP ও এক্সপায়ারি আপডেট (এটি দ্রুত হবে)
    await prisma.user.update({
      where: { email },
      data: {
        resetOtp: otp,
        resetOtpExpiresAt: expiresAt,
      },
    });

    // ২. ব্যাকগ্রাউন্ডে ইমেইল সেন্ডিং ইভেন্ট ট্রিগার (নন-ব্লকিং)
    userEvents.emit('otpRequested', {
      email,
      otp,
    });

    return true;
  },

  // ৪. OTP ভেরিফিকেশন
  async verifyOtp(email: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetOtp !== otp) {
      throw new Error('অবৈধ OTP কোড');
    }

    if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
      throw new Error('OTP-এর মেয়াদ শেষ হয়ে গেছে');
    }

    return true;
  },

  // ৫. OTP দিয়ে পাসওয়ার্ড রিসেট
  async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetOtp !== otp) {
      throw new Error('অবৈধ OTP কোড');
    }

    if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
      throw new Error('OTP-এর মেয়াদ শেষ হয়ে গেছে');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpiresAt: null,
      },
    });

    return true;
  },
};