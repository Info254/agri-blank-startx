
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RequestRecord {
  timestamp: number;
  success: boolean;
}

class RateLimiter {
  private requests = new Map<string, RequestRecord[]>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string, isSuccess: boolean = true): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests for this identifier
    let userRequests = this.requests.get(identifier) || [];
    
    // Filter out requests outside the current window
    userRequests = userRequests.filter(req => req.timestamp > windowStart);
    
    // Apply skip rules
    const relevantRequests = userRequests.filter(req => {
      if (this.config.skipSuccessfulRequests && req.success) return false;
      if (this.config.skipFailedRequests && !req.success) return false;
      return true;
    });
    
    // Check if limit exceeded
    if (relevantRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add current request
    userRequests.push({ timestamp: now, success: isSuccess });
    this.requests.set(identifier, userRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(req => req.timestamp > windowStart);
    
    const relevantRequests = recentRequests.filter(req => {
      if (this.config.skipSuccessfulRequests && req.success) return false;
      if (this.config.skipFailedRequests && !req.success) return false;
      return true;
    });
    
    return Math.max(0, this.config.maxRequests - relevantRequests.length);
  }

  getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier) || [];
    if (userRequests.length === 0) return 0;
    
    const oldestRequest = userRequests[0];
    return oldestRequest.timestamp + this.config.windowMs;
  }

  clear(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }

  // Clean up old requests periodically
  cleanup(): void {
    const now = Date.now();
    
    for (const [identifier, requests] of this.requests.entries()) {
      const activeRequests = requests.filter(
        req => now - req.timestamp < this.config.windowMs
      );
      
      if (activeRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, activeRequests);
      }
    }
  }
}

// Pre-configured rate limiters for different use cases
export const apiRateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 30
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 300000, // 5 minutes
  maxRequests: 10
});

// Start cleanup interval
setInterval(() => {
  apiRateLimiter.cleanup();
  searchRateLimiter.cleanup();
  uploadRateLimiter.cleanup();
}, 60000); // Clean up every minute

export default RateLimiter;
