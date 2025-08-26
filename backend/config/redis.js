import { createClient } from 'redis';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

let client = null;

if (REDIS_ENABLED) {
  client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  client.on('error', (err) => {
    logger.error('Redis client error', err);
  });

  client.on('connect', () => {
    logger.info('Redis connected successfully');
  });
}

export async function connectRedis() {
  if (!REDIS_ENABLED) {
    logger.info('Redis disabled for development');
    return;
  }
  
  try {
    await client.connect();
  } catch (error) {
    logger.error('Redis connection failed', error);
  }
}

// Mock Redis client for development
const mockRedisClient = {
  isOpen: false,
  get: async () => null,
  setEx: async () => 'OK',
  set: async () => 'OK',
  del: async () => 1
};

export const redisClient = REDIS_ENABLED ? client : mockRedisClient;