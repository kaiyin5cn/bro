import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('Redis connected');
});

export async function connectRedis() {
  try {
    await client.connect();
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
}

export { client as redisClient };