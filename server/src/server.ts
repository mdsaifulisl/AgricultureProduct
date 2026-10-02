import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import app from './app.js';
import { connectDB } from './config/prisma.js';
import prisma from './config/prisma.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const seedDefaultAdmin = async () => {
  try {
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await prisma.user.create({
        data: {
          name: 'System Admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: 'admin',
          status: 'active',
        },
      });

      console.log('🌱 Default Admin Created: admin@gmail.com | Password: admin123');
    }
  } catch (error: any) {
    console.error('⚠️ Failed to seed default admin:', error.message);
  }
};

const startServer = async () => {
  try {
    // ১. ডেটাবেজ কানেক্ট করা
    await connectDB();

    // ২. ডিফল্ট অ্যাডমিন চেক ও তৈরি
    await seedDefaultAdmin();

    // ৩. এক্সপ্রেস সার্ভার চালু করা
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();