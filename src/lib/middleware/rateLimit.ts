import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = Redis.fromEnv();

interface RateLimitOptions {
  /**
   * Number of requests allowed per time window
   * @default 10
   */
  max?: number;
  /**
   * Time window in seconds
   * @default 60
   */
  window?: number;
  /**
   * Custom error message
   */
  errorMessage?: string;
}

export const rateLimit = (options: RateLimitOptions = {}) => {
  const { max = 10, window = 60, errorMessage = 'Too many requests' } = options;

  return async (req: Request) => {
    // Skip rate limiting for GET requests
    if (req.method === 'GET') {
      return NextResponse.next();
    }

    try {
      // Use IP address as the rate limit key
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      const key = `rate_limit:${ip}`;

      // Get current request count
      const current = await redis.get<number>(key);

      if (current !== null && current >= max) {
        return new NextResponse(
          JSON.stringify({ error: errorMessage }), 
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': window.toString(),
              'X-RateLimit-Limit': max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + window).toString()
            }
          }
        );
      }

      // Increment the counter
      const pipeline = redis.pipeline();
      pipeline.incr(key);
      pipeline.expire(key, window);
      await pipeline.exec();

      // Add rate limit headers to the response
      const remaining = Math.max(0, max - (current || 0) - 1);
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', max.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', (Math.floor(Date.now() / 1000) + window).toString());

      return response;
    } catch (error) {
      console.error('Rate limit error:', error);
      // Fail open in case of Redis errors
      return NextResponse.next();
    }
  };
};
