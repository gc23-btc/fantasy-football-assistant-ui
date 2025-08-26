interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.store[identifier];

    // Clean up expired records
    if (record && now > record.resetTime) {
      delete this.store[identifier];
    }

    // If no record exists, create one
    if (!this.store[identifier]) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return true;
    }

    // Check if within limits
    if (this.store[identifier].count < this.config.maxRequests) {
      this.store[identifier].count++;
      return true;
    }

    return false;
  }

  getRemaining(identifier: string): number {
    const record = this.store[identifier];
    if (!record) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - record.count);
  }

  getResetTime(identifier: string): number {
    const record = this.store[identifier];
    return record ? record.resetTime : Date.now() + this.config.windowMs;
  }

  // Clean up expired records periodically
  cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Create rate limiters for different endpoints
export const leagueRateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 30, // 30 requests per minute
});

export const scoreboardRateLimiter = new RateLimiter({
  windowMs: 30000, // 30 seconds
  maxRequests: 60, // 60 requests per 30 seconds
});

export const adviceRateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 requests per minute (more expensive)
});

// Clean up expired records every 5 minutes
setInterval(() => {
  leagueRateLimiter.cleanup();
  scoreboardRateLimiter.cleanup();
  adviceRateLimiter.cleanup();
}, 300000);

export function getClientIP(req: Request): string {
  // In a real deployment, you'd get this from headers
  // For now, we'll use a simple hash of the user agent
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return userAgent.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0).toString();
}
