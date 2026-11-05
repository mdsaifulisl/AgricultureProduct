import { createClient } from 'redis';
import { RedisStore } from 'rate-limit-redis';

const redisUrl = process.env.REDIS_URL;
const workerCount = Number(process.env.WEB_CONCURRENCY || 1);

if (process.env.NODE_ENV === 'production' && workerCount > 1 && !redisUrl) {
  throw new Error('একাধিক worker চালাতে REDIS_URL আবশ্যক, যাতে rate limit সব worker-এ ভাগ হয়।');
}

const redisClient = redisUrl ? createClient({ url: redisUrl }) : undefined;

if (redisClient) {
  redisClient.on('error', (error) => console.error('Redis rate-limit connection error:', error.message));
  await redisClient.connect();
}

export const createRateLimitStore = (prefix: string) => redisClient
  ? new RedisStore({
      prefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    })
  : undefined;

export const closeRateLimitStore = async () => {
  if (redisClient?.isOpen) await redisClient.quit();
};
