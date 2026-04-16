import { TokenBucketRateLimiter } from "../src/main";

const limiter = new TokenBucketRateLimiter(100, 10);

function simulate() {
  const customer = "stripe-test";

  console.log("T=0ms → First request");
  console.log(limiter.check(customer, 0));

  console.log("\nT=0ms → 60 requests");
  for (let i = 0; i < 60; i++) {
    limiter.check(customer, 0);
  }

  console.log("\nT=2000ms → After refill");
  console.log(limiter.check(customer, 2000));

  console.log("\nT=2000ms → 70 requests");
  let denied = 0;
  for (let i = 0; i < 70; i++) {
    const res = limiter.check(customer, 2000);
    if (!res.allowed) denied++;
  }
  console.log("Denied:", denied);

  console.log("\nT=7000ms → Refill");
  console.log(limiter.check(customer, 7000));
}

simulate();