import { createClient, RedisClientType } from 'redis';
import config from './index.js';

let redisClient: RedisClientType | null = null;

/**
 * Get or create Redis client instance (singleton pattern)
 */
export const getRedisClient = async (): Promise<RedisClientType> => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Create Redis client
  redisClient = createClient({
    socket: {
      host: config.redis.host,
      port: config.redis.port,
    },
    password: config.redis.password,
    database: config.redis.db,
  });

  // Error handling
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.info(`Redis connected to ${config.redis.host}:${config.redis.port}`);
  });

  redisClient.on('ready', () => {
    console.info('Redis client ready');
  });

  redisClient.on('end', () => {
    console.info('Redis connection closed');
  });

  // Connect to Redis
  await redisClient.connect();

  return redisClient;
};

/**
 * Close Redis connection
 */
export const closeRedisClient = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.info('Redis client disconnected');
  }
};

/**
 * Check if Redis is connected
 */
export const isRedisConnected = (): boolean => {
  return redisClient !== null && redisClient.isOpen;
};
