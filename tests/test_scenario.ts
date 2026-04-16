import { TokenBucketRateLimiter } from "../src/main";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("❌ FAIL:", message);
  } else {
    console.log("✅ PASS:", message);
  }
}

const limiter = new TokenBucketRateLimiter(100, 10);
const customer = "stripe-test";

/**
 * T = 0ms → First request
 * Bucket should start FULL (100 tokens)
 */
let res = limiter.check(customer, 0);
assert(res.allowed === true, "First request should be allowed");
assert(res.remaining === 99, "Remaining tokens should be 99");

/**
 * T = 0ms → 60 requests
 * Bucket: 100 → 40
 */
for (let i = 0; i < 60; i++) {
  limiter.check(customer, 0);
}

res = limiter.check(customer, 0);
assert(res.remaining === 39, "After 61st request, remaining should be 39");

/**
 * T = 2000ms → Refill
 * Expected: 40 + (2 * 10) = 60
 */
res = limiter.check(customer, 2000);
assert(res.allowed === true, "Request after refill should be allowed");
assert(res.remaining === 59, "Remaining should be 59 after consuming 1");

/**
 * T = 2000ms → 70 requests
 * Only 60 tokens available → 10 denied
 */
let denied = 0;
for (let i = 0; i < 70; i++) {
  const r = limiter.check(customer, 2000);
  if (!r.allowed) denied++;
}
assert(denied === 10, "10 requests should be denied");

/**
 * T = 7000ms → Refill
 * Expected: 0 + (5 * 10) = 50
 */
res = limiter.check(customer, 7000);
assert(res.allowed === true, "Request at 7000ms should be allowed");
assert(res.remaining === 49, "Remaining should be 49");

/**
 * T = 7000ms → 30 requests
 * Bucket: 50 → 20
 */
for (let i = 0; i < 30; i++) {
  limiter.check(customer, 7000);
}

res = limiter.check(customer, 7000);
assert(res.remaining === 19, "Remaining should be 19");

/**
 * T = 17000ms → Refill
 * Expected: 20 + (10 * 10) = 120 → capped at 100
 */
res = limiter.check(customer, 17000);
assert(res.allowed === true, "Request should be allowed after cap refill");
assert(res.remaining === 99, "Remaining should be capped at 99");

/**
 * T = 17000ms → 80 requests
 * Bucket: 100 → 20
 */
for (let i = 0; i < 80; i++) {
  limiter.check(customer, 17000);
}

res = limiter.check(customer, 17000);
assert(res.remaining === 19, "Final remaining should be 19");

console.log("\n🎉 Scenario test completed!");