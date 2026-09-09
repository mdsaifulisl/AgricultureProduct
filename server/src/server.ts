import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/prisma.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ১. ডেটাবেজ কানেক্ট করা
    await connectDB();

    // ২. এক্সপ্রেস সার্ভার চালু করা
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();