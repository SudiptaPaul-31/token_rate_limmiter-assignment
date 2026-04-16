# IMPLEMENTATION_NOTES.md

## Overview

This implementation provides a production-ready **Token Bucket Rate Limiter** in TypeScript that adheres strictly to the problem requirements. It supports per-customer rate limiting with continuous token refill, accurate retry timing, and correct handling of burst traffic.

---

## Key Design Decisions

### 1. On-Demand Continuous Refill (Chosen Approach)

Instead of using a background timer (as suggested in the problem statement), tokens are refilled **only when a request arrives**.

**Reason:**

* Ensures precise and continuous refill based on elapsed time
* Avoids unnecessary computation for inactive users
* Scales efficiently in distributed systems
* Aligns with requirement: *"Refill tokens continuously based on elapsed time"*

---

### 2. Floating Point Token Storage

Tokens are stored internally as `number` (float), not integers.

**Reason:**

* Allows fractional token accumulation (e.g., 0.5 tokens)
* Ensures smooth and accurate refill behavior over time
* Prevents loss of precision in high-frequency systems

**Note:** Output values (`remaining`) are always floored to integers.

---

### 3. Lazy Initialization of Buckets

A customer bucket is initialized **only on the first request**, with full capacity.

**Reason:**

* Fixes bug from starter code (initializing with 0 tokens)
* Ensures first request is always allowed
* Avoids pre-allocating memory for all customers

---

### 4. Capacity Capping

After refill, tokens are capped using:

```ts
bucket.tokens = Math.min(capacity, bucket.tokens);
```

**Reason:**

* Prevents token overflow
* Maintains strict bucket size constraints
* Ensures fairness across users

---

### 5. Accurate Retry Time Calculation

When a request is denied:

```ts
retry_after_ms = Math.ceil((tokensNeeded / refillRate) * 1000);
```

**Reason:**

* Converts seconds → milliseconds correctly (fixes bug)
* Uses `ceil` to avoid premature retries
* Guarantees at least 1 token will be available when retried

---

### 6. Time-Based Refill Logic

Refill is computed as:

```ts
tokensToAdd = (elapsed_ms / 1000) * refill_rate
```

**Reason:**

* Ensures refill is proportional to actual time passed
* Works correctly for irregular request intervals
* No dependency on fixed intervals or timers

---

### 7. Data Structures Used

* `Map<string, Bucket>`

  * Key: `customer_id`
  * Value: `{ tokens, lastRefillTime }`

**Reason:**

* O(1) lookup per request
* Efficient for large number of customers
* Clean and scalable design

---

## Correctness Guarantees

This implementation ensures:

* First request is always allowed (bucket starts full)
* Tokens refill continuously over time
* Bucket never exceeds capacity
* Requests are denied only when tokens < 1
* Retry time is always accurate and non-zero when denied

---

## Edge Cases Handled

* Multiple requests at the same timestamp
* Large time gaps (ensures proper refill + cap)
* Fractional token accumulation
* Immediate retry after denial
* Zero or negative elapsed time (no refill applied)

---

## Performance Considerations

* Time Complexity: **O(1)** per request
* Space Complexity: **O(N)** where N = number of active customers
* No background threads or timers required
* Efficient for high-throughput systems

---

## Known Trade-offs

* Uses floating point arithmetic (minor precision limitations possible)
* Not thread-safe (can be extended using locks or atomic operations if needed)
* In-memory storage (can be replaced with Redis for distributed systems)

---

## Possible Enhancements

* Distributed rate limiting using Redis
* Sliding window hybrid approach
* Per-endpoint rate limiting
* Burst + sustained rate configuration
* Logging and monitoring hooks

---

## Conclusion

The implementation strictly follows the Token Bucket algorithm with all bugs fixed from the starter code and aligns fully with the requirements. It is efficient, scalable, and suitable for real-world API rate limiting scenarios.
