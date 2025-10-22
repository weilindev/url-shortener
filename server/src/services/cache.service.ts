import { getRedisClient, isRedisConnected } from '../config/redis.js';
import type { Url } from '../types/url.types.js';

/**
 * Default TTL for URL cache (1 hour)
 */
const DEFAULT_URL_TTL = 3600;

/**
 * Cache key prefix for URLs
 */
const URL_CACHE_PREFIX = 'url:';

/**
 * Generate cache key for URL by short code
 */
const getUrlCacheKey = (shortCode: string): string => {
  return `${URL_CACHE_PREFIX}${shortCode}`;
};

/**
 * Cache Service for URL shortener
 * Provides caching layer using Redis
 */
export class CacheService {
  /**
   * Set URL data in cache
   * @param shortCode - The short code of the URL
   * @param urlData - The URL data to cache
   * @param ttl - Time to live in seconds (default: 1 hour)
   */
  static async setUrl(
    shortCode: string,
    urlData: Url,
    ttl: number = DEFAULT_URL_TTL
  ): Promise<void> {
    try {
      if (!isRedisConnected()) {
        console.warn('Redis is not connected, skipping cache set');
        return;
      }

      const client = await getRedisClient();
      const key = getUrlCacheKey(shortCode);

      // Store as JSON string with TTL
      await client.setEx(key, ttl, JSON.stringify(urlData));
    } catch (error) {
      console.error('Cache set error:', error);
      // Don't throw error, just log it - cache failure shouldn't break the app
    }
  }

  /**
   * Get URL data from cache
   * @param shortCode - The short code of the URL
   * @returns URL data if found, null otherwise
   */
  static async getUrl(shortCode: string): Promise<Url | null> {
    try {
      if (!isRedisConnected()) {
        console.warn('Redis is not connected, skipping cache get');
        return null;
      }

      const client = await getRedisClient();
      const key = getUrlCacheKey(shortCode);

      const cached = await client.get(key);

      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as Url;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete URL from cache
   * @param shortCode - The short code of the URL
   */
  static async deleteUrl(shortCode: string): Promise<void> {
    try {
      if (!isRedisConnected()) {
        console.warn('Redis is not connected, skipping cache delete');
        return;
      }

      const client = await getRedisClient();
      const key = getUrlCacheKey(shortCode);

      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Invalidate (delete) multiple URLs from cache
   * @param shortCodes - Array of short codes to invalidate
   */
  static async invalidateUrls(shortCodes: string[]): Promise<void> {
    try {
      if (!isRedisConnected()) {
        console.warn('Redis is not connected, skipping cache invalidation');
        return;
      }

      const client = await getRedisClient();
      const keys = shortCodes.map(getUrlCacheKey);

      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  /**
   * Check if URL exists in cache
   * @param shortCode - The short code of the URL
   * @returns true if exists, false otherwise
   */
  static async hasUrl(shortCode: string): Promise<boolean> {
    try {
      if (!isRedisConnected()) {
        return false;
      }

      const client = await getRedisClient();
      const key = getUrlCacheKey(shortCode);

      const exists = await client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Cache exists check error:', error);
      return false;
    }
  }

  /**
   * Clear all URL caches (use with caution)
   */
  static async clearAllUrls(): Promise<void> {
    try {
      if (!isRedisConnected()) {
        console.warn('Redis is not connected, skipping cache clear');
        return;
      }

      const client = await getRedisClient();

      // Find all keys matching the URL cache prefix
      const keys = await client.keys(`${URL_CACHE_PREFIX}*`);

      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Cache clear all error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats(): Promise<{ totalUrlCaches: number }> {
    try {
      if (!isRedisConnected()) {
        return { totalUrlCaches: 0 };
      }

      const client = await getRedisClient();
      const keys = await client.keys(`${URL_CACHE_PREFIX}*`);

      return {
        totalUrlCaches: keys.length,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { totalUrlCaches: 0 };
    }
  }
}
