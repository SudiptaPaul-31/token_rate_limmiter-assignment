import { Decision } from "./types";

interface Bucket {
  tokens: number;
  lastRefillTime: number; 
}

export class TokenBucketRateLimiter {
  private capacity: number;
  private refillRate: number; 
  private buckets: Map<string, Bucket>;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.buckets = new Map();
  }

  private refill(bucket: Bucket, currentTimeMs: number) {
    const elapsedMs = currentTimeMs - bucket.lastRefillTime;

    if (elapsedMs <= 0) return;

    const tokensToAdd = (elapsedMs / 1000) * this.refillRate;

    bucket.tokens = Math.min(
      this.capacity,
      bucket.tokens + tokensToAdd
    );

    bucket.lastRefillTime = currentTimeMs;
  }

  check(customerId: string, currentTimeMs: number): Decision {
    if (!this.buckets.has(customerId)) {
      this.buckets.set(customerId, {
        tokens: this.capacity,
        lastRefillTime: currentTimeMs,
      });
    }

    const bucket = this.buckets.get(customerId)!;

    this.refill(bucket, currentTimeMs);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;

      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        retry_after_ms: 0,
      };
    } else {
      const tokensNeeded = 1 - bucket.tokens;

      const secondsToWait = tokensNeeded / this.refillRate;

      return {
        allowed: false,
        remaining: 0,
        retry_after_ms: Math.ceil(secondsToWait * 1000), 
      };
    }
  }
}