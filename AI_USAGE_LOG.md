# AI_USAGE_LOG.md

## AI Interaction #1

**Time:** 12:35 PM
**Tool:** ChatGPT

**My Prompt:**
Explain the Token Bucket Rate Limiter and how continuous refill works.

**What I Kept:**

* Basic understanding of token bucket concept
* Idea of refill based on elapsed time instead of fixed intervals

**What I Changed/Rejected:**

* Did not follow the suggested background timer approach since it contradicted the problem requirement
* Designed my own logic for on-demand refill inside the `check` function

---

## AI Interaction #2

**Time:** 12:55 PM
**Tool:** ChatGPT

**My Prompt:**
How to calculate retry_after_ms correctly in a rate limiter?

**What I Kept:**

* Formula: tokens_needed / refill_rate
* Conversion from seconds to milliseconds

**What I Changed/Rejected:**

* Used `Math.ceil()` instead of direct conversion to avoid early retries
* Adjusted calculation to match exact requirement of returning milliseconds

---

## AI Interaction #3

**Time:** 1:15 PM
**Tool:** ChatGPT

**My Prompt:**
Review my TypeScript logic for token bucket and suggest improvements.

**What I Kept:**

* Suggestion to cap tokens at capacity using `Math.min()`
* Validation of refill logic using elapsed time

**What I Changed/Rejected:**

* Did not adopt full suggested structure; kept my own class design
* Refactored variable names and structure for better readability

---

## AI Interaction #4

**Time:** 1:35 PM
**Tool:** ChatGPT

**My Prompt:**
Help me design test cases for the given scenario.

**What I Kept:**

* Idea of simulating timestamps step-by-step
* Checking allowed/denied requests

**What I Changed/Rejected:**

* Wrote my own assertions and logging format
* Simplified test flow to match assignment scenario exactly

---
## AI Interaction #5

**Time:** 1:05 PM
**Tool:** ChatGPT

**My Prompt:**
How to structure a Map for storing per-user buckets in TypeScript?

**What I Kept:**

* Using `Map<string, Bucket>` for O(1) lookup
* Storing both `tokens` and `lastRefillTime` in a single object

**What I Changed/Rejected:**

* Modified the structure to use a custom `Bucket` interface instead of inline typing
* Avoided using classes for Bucket to keep it lightweight

**Code Used for Verification:**

```ts
interface Bucket {
  tokens: number;
  lastRefillTime: number;
}

const buckets = new Map<string, Bucket>();

buckets.set("test", { tokens: 10, lastRefillTime: 0 });

console.log(buckets.get("test"));
```

---

## AI Interaction #6

**Time:** 1:20 PM
**Tool:** ChatGPT

**My Prompt:**
Check if this refill calculation is correct: tokens += (elapsed / 1000) * rate

**What I Kept:**

* Confirmation of formula correctness
* Suggestion to guard against negative elapsed time

**What I Changed/Rejected:**

* Added explicit check `if (elapsed <= 0) return;`
* Integrated logic into my own refill function instead of separate utility

**Code Used for Testing:**

```ts
const elapsed = 2000; // ms
const rate = 10;

const tokensToAdd = (elapsed / 1000) * rate;

console.log(tokensToAdd); // expected: 20
```

---

## AI Interaction #7

**Time:** 1:28 PM
**Tool:** ChatGPT

**My Prompt:**
How to ensure retry_after_ms is never zero when request is denied?

**What I Kept:**

* Use of `Math.ceil()` to round up wait time

**What I Changed/Rejected:**

* Avoided returning raw float values
* Ensured minimum wait is always at least 1ms when denied

**Code Experiment:**

```ts
const tokensNeeded = 0.2;
const rate = 10;

const wait = Math.ceil((tokensNeeded / rate) * 1000);

console.log(wait); // should not be 0
```

---

## AI Interaction #8

**Time:** 1:40 PM
**Tool:** ChatGPT

**My Prompt:**
Help debug why my bucket sometimes exceeds capacity.

**What I Kept:**

* Suggestion to use `Math.min(capacity, tokens)`

**What I Changed/Rejected:**

* Moved capping logic inside refill function only
* Ensured it is always applied after adding tokens

**Code Used for Debugging:**

```ts
let tokens = 120;
const capacity = 100;

tokens = Math.min(capacity, tokens);

console.log(tokens); // expected: 100
```

---
