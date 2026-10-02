import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '../utils/generatePassword.js';
import { userEvents } from '../events/user.events.js';

const prisma = new PrismaClient();

export const UserService = {
  // ১. ইউজার লিস্ট
  async getAllUsers(search?: string, role?: string) {
    return prisma.user.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          role && role !== 'all' ? { role: role as Role } : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ২. অটো-জেনারেটেড পাসওয়ার্ড দিয়ে ইউজার তৈরি ও ব্যাকগ্রাউন্ড ইমেইল ট্র্রিগার
  async createUser(data: { name: string; email: string; phone?: string; role: 'admin' | 'moderator' | 'seller' }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট তৈরি করা হয়েছে');

    const rawPassword = generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // ব্যাকগ্রাউন্ডে ইমেইল পাঠানোর জন্য ইভেন্ট ফায়ার (নন-ব্লকিং)
    userEvents.emit('userCreated', {
      email: user.email,
      name: user.name,
      rawPassword,
    });

    // সিকিউরিটির স্বার্থে রেসপন্স থেকে হ্যাশ পাসওয়ার্ড বাদ দেওয়া হয়েছে
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // ৩. ইউজার তথ্য আপডেট
  async updateUser(id: string, data: Record<string, any>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  // ৪. ডিলিট ইউজার
  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};