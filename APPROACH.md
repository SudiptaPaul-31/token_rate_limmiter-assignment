# Candidate Name
Sudipta Paul

# Chosen Language
TypeScript


## 1. Problem Statement
We are running a REST API where each customer has their own rate limit.  
And customer has a bucket of tokens, and with every API request a token is consumed.  
Tokens are refilled at fixed intervals with a fixed rate. And we noticed an issue that some customers are getting rate-limited on their very first request even though their bucket should be full. When a request was denied, the response returned retry_after_ms = 0 and giving clients no guidance on when to retry


## 2. Assumptions
Firstly the bucket of tokens of users starts with full capacity when they are making their first requests.
Secondly the tokens are refilled at a certain time after the last request is being made. 
One last every user much have their single own bucket.

## 3. Errors Found
 the bucket is starting with 0 tokens. So it should start with full bucket token that is 100 tokens.
 the retry_after_ms is calculated in seconds but it should return the value in milliseconds  
 the refill is not capped so tokens can exceed a certain limit if not capping is provided so capping must be like 100


## 4. Bugs Found
On the line 21 the bucket is initialized with 0 tokens it should initialize with the capacity or self.capacity from line 14;
On the line 28 the tokens can exceed the maximum limit which is set while refelling. 
On the line 43 the retry_after_ms is returing integer value it must return in millisecons; 
Lastly the last_refill functionality is getting updated even before the token usage.


## 5. Solution Design
 Algorithm: Token Bucket
 Tokens should be capped at certain limit and inital token assigned to users should be 100. 
 It should decrease only after user makes a request and user should have minimum 1 token to make a request. 
 and if the token is less than 1 it should deny it. 
 And refill logic sholuld be implemented properly. 

### Data Structure
We can use hashmap like which stores values in key value pair meaning it should store users id and token; 

### Formulas
token_need_to_add = (elapsed_time/1000) * refill_rate; 
Capping Logic -> token_in_bucket = min(bucket+tokens_to_add, capacity); 
Retry Logic -> retryafter_ms = (tokens_need_to_add/refill_rate) * 1000;

## 6. Walkthrough Example
Capacity: 100 tokens  
Refill Rate: 10 tokens/second  

At T = 0ms:
Tokens = 100  

After 60 requests: Tokens left = 40  

At T = 3000ms:
Elapsed = 3000ms  
Tokens to add = (3000 / 1000) * 10 = 30  
New tokens = min(40 + 30, 100) = 70 
