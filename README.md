# 🚀 Token Bucket Rate Limiter (TypeScript)

Implementation of a **Token Bucket Rate Limiter** for a multi-tenant SaaS API, built as part of the AQB Solutions Campus Screening Assignment.

---

## 📌 Problem Overview

The system limits API usage per customer using the **Token Bucket Algorithm**:

* Each customer has a bucket with a fixed capacity
* Every request consumes **1 token**
* Tokens refill **continuously over time**
* Requests are **denied when tokens are insufficient**

---

## ⚙️ Configuration

Example configuration used:

* **Capacity:** 100 tokens
* **Refill Rate:** 10 tokens/second

---

## 🧠 Key Features

* ✅ Continuous time-based refill (no background jobs)
* ✅ Accurate retry timing (`retry_after_ms`)
* ✅ Per-customer isolation
* ✅ Capacity capping
* ✅ Handles burst traffic efficiently
* ✅ O(1) request processing

---

## 🏗️ Project Structure

```
submission/
├── demo/
│   └── simulate.ts          # Demo simulation
├── src/
│   ├── main.ts              # Core rate limiter implementation
│   └── types.ts             # Type definitions
├── tests/
│   ├── test_scenario.ts     # Scenario-based test
│   └── test_edge_cases.ts   # Edge case tests
├── APPROACH.md
├── IMPLEMENTATION_NOTES.md
├── AI_USAGE_LOG.md
├── tsconfig.json
```

---

## ▶️ How It Works

1. On first request, bucket is initialized with full capacity
2. Before every request:

   * Tokens are refilled based on elapsed time
3. If tokens ≥ 1:

   * Request is allowed
   * Token is consumed
4. If tokens < 1:

   * Request is denied
   * `retry_after_ms` is calculated

---

## 🧪 Running the Project

### 1. Install dependencies (if any)

```bash
npm install
```

### 2. Compile TypeScript

```bash
npx tsc
```

### 3. Run demo

```bash
node dist/demo/simulate.js
```

### 4. Run tests

```bash
node dist/tests/test_scenario.js
node dist/tests/test_edge_cases.js
```

---

## 📊 Example Behavior

| Time (ms) | Action           | Tokens   |
| --------- | ---------------- | -------- |
| 0         | Initial request  | 100 → 99 |
| 0         | 60 requests      | 40       |
| 2000      | Refill + request | 60 → 59  |
| 7000      | Refill + request | 50 → 49  |
| 17000     | Refill (capped)  | 100      |

---

## ⚠️ Fixes Applied (from Starter Code)

* Bucket initialized with **full capacity**
* Added **capacity cap** after refill
* Corrected **retry_after_ms (ms instead of seconds)**
* Implemented **continuous refill logic**

---

## 🔧 Design Choices

* Used `Map<string, Bucket>` for efficient lookup
* Floating point tokens for precision
* `Math.ceil()` for safe retry timing
* On-demand refill for scalability

---

## 🚀 Possible Enhancements

* Distributed rate limiting using Redis
* Multi-level rate limiting (per endpoint/user)
* Monitoring & logging integration

---

## 📌 Conclusion

This implementation provides a scalable and accurate rate limiter suitable for real-world API systems, while strictly adhering to the assignment requirements.

---

**Author:** Sudipta Paul
