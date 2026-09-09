import { PrismaClient } from '@prisma/client';

// prisma-কে স্পষ্ট করে PrismaClient টাইপ বলে দিন
const prisma: PrismaClient = new PrismaClient({
  log: ['error', 'warn'],
});

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database Connected Successfully via Prisma!');
  } catch (error: any) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

export default prisma;