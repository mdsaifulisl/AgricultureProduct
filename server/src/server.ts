import 'dotenv/config';
import bcrypt from 'bcrypt';
import app from './app.js';
import { connectDB } from './config/prisma.js';
import prisma from './config/prisma.js';
import { closeRateLimitStore } from './config/rateLimitStore.js';

const PORT = process.env.PORT || 5000;

const seedDefaultAdmin = async () => {
  try {
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;
      const initialEmail = process.env.INITIAL_ADMIN_EMAIL;
      if (!initialPassword || !initialEmail) {
        console.warn('প্রাথমিক admin তৈরি হয়নি: INITIAL_ADMIN_EMAIL ও INITIAL_ADMIN_PASSWORD সেট করুন।');
        return;
      }
      const hashedPassword = await bcrypt.hash(initialPassword, 12);

      await prisma.user.create({
        data: {
          name: 'System Admin',
          email: initialEmail,
          password: hashedPassword,
          role: 'admin',
          status: 'active',
        },
      });

      console.log(`প্রাথমিক admin তৈরি হয়েছে: ${initialEmail}`);
    }
  } catch (error: any) {
    console.error('⚠️ Failed to seed default admin:', error.message);
  }
};

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET আবশ্যক এবং অন্তত ৩২ অক্ষরের হতে হবে।');
    }
    // ১. ডেটাবেজ কানেক্ট করা
    await connectDB();

    // ২. ডিফল্ট অ্যাডমিন চেক ও তৈরি
    await seedDefaultAdmin();

    // ৩. এক্সপ্রেস সার্ভার চালু করা
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
    const shutdown = () => server.close(() => Promise.all([prisma.$disconnect(), closeRateLimitStore()]).finally(() => process.exit(0)));
    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
