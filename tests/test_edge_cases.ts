import { TokenBucketRateLimiter } from "../src/main";

const limiter = new TokenBucketRateLimiter(5, 1);

console.log(limiter.check("user", 0)); 
for (let i = 0; i < 5; i++) {
  limiter.check("user", 0);
}

console.log(limiter.check("user", 0));
console.log(limiter.check("user", 1000));