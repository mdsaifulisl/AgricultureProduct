import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

interface GetUsersQuery {
  search?: string;
  role?: string;
}

export const UserController = {
  // ১. ইউজার লিস্ট ফিল্টার সহ গেট করা
  async getUsers(
    req: Request<{}, {}, {}, GetUsersQuery>,
    res: Response
  ) {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const role = typeof req.query.role === 'string' ? req.query.role : undefined;

      const users = await UserService.getAllUsers(search, role);
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'ইউজারদের তালিকা পেতে সমস্যা হয়েছে',
      });
    }
  },

  // ২. নতুন ইউজার তৈরি ও অটো-পাসওয়ার্ড ইমেইলে পাঠানো
  async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'ইউজার তৈরি করা হয়েছে এবং ইমেইলে পাসওয়ার্ড পাঠানো হয়েছে',
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'নতুন ইউজার তৈরি করতে ব্যর্থ হয়েছে',
      });
    }
  },

  // ৩. ইউজার তথ্য আপডেট
  async updateUser(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(id, req.body);
      res.status(200).json({
        success: true,
        message: 'ইউজার তথ্য আপডেট হয়েছে',
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'ইউজার আপডেট করতে ব্যর্থ হয়েছে',
      });
    }
  },

  // ৪. ইউজার ডিলিট করা
  async deleteUser(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: 'ইউজার সফলভাবে মুছে ফেলা হয়েছে',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'ইউজার মুছে ফেলতে সমস্যা হয়েছে',
      });
    }
  },
};