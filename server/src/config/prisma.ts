import { PrismaClient } from '@prisma/client';

// prisma-কে স্পষ্ট করে PrismaClient টাইপ বলে দিন
const databaseUrl = process.env.DATABASE_URL;
const poolUrl = databaseUrl ? (() => {
  const url = new URL(databaseUrl);
  if (!url.searchParams.has('connection_limit')) url.searchParams.set('connection_limit', process.env.DB_POOL_SIZE || '10');
  if (!url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', process.env.DB_POOL_TIMEOUT || '20');
  return url.toString();
})() : undefined;

const prisma: PrismaClient = new PrismaClient({
  ...(poolUrl ? { datasources: { db: { url: poolUrl } } } : {}),
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

process.once('beforeExit', async () => { await prisma.$disconnect(); });

export default prisma;
