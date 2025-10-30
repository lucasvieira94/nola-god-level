import { Request, Response, NextFunction } from "express";

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheMiddleware = (duration: number = CACHE_DURATION) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Create cache key from URL and query params
    const cacheKey = `${req.path}?${JSON.stringify(req.query)}`;
    const cachedEntry = cache.get(cacheKey);

    // Check if cache exists and is still valid
    if (cachedEntry && Date.now() - cachedEntry.timestamp < duration) {
      return res.json(cachedEntry.data);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (data: any) => {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      return originalJson(data);
    };

    next();
  };
};

// Clear expired cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Clear all cache
export const clearCache = () => {
  cache.clear();
};
