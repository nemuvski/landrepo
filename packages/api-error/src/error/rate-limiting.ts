export const RateLimitingErrorMessage = {
  TooManyRequests: 'too many requests',
} as const

export type RateLimitingErrorMessageType = typeof RateLimitingErrorMessage[keyof typeof RateLimitingErrorMessage]
