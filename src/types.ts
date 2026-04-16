export interface Decision {
  allowed: boolean;
  remaining: number;
  retry_after_ms: number;
}