export const RateLimitErrorMessage = {
  TooManyRequests: 'too many requests',
} as const

export type RateLimitErrorMessageType = (typeof RateLimitErrorMessage)[keyof typeof RateLimitErrorMessage]
