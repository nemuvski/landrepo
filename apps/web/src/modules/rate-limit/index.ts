import { RateLimitErrorMessage } from '@project/api-error'
import LRU from 'lru-cache'
import requestIp from 'request-ip'
import ApiRouteError from '~/exceptions/api-route.error'
import type { NextApiRequest, NextApiResponse } from 'next'

type Options = {
  // [ms]
  interval?: number
  uniqueTokenPerInterval?: number
}

/**
 * NOTE: アプリケーションの規模やホスティングのスペックによってパラメータは要調整
 *
 * @param options
 */
function rateLimitChecker(options?: Options) {
  const cache = new LRU({
    max: options?.uniqueTokenPerInterval || 500,
    // [ms]
    ttl: options?.interval || 30000,
  })

  return {
    /**
     * NOTE: cacheのttlの時間のうち、引数limit回数までOK
     *
     * @param res
     * @param token
     * @param limit
     */
    check: (res: NextApiResponse, token: string, limit: number = 10) => {
      const count = (cache.get(token) as number[]) || [0]
      if (count[0] === 0) {
        cache.set(token, count)
      }
      count[0] += 1

      const currentUsage = count[0]
      const isRateLimited = currentUsage >= limit
      res.setHeader('X-RateLimit-Limit', limit)
      res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage)

      if (isRateLimited) {
        throw new ApiRouteError(429, RateLimitErrorMessage.TooManyRequests)
      }
    },
  }
}

export function getRateLimitToken(req: NextApiRequest) {
  return requestIp.getClientIp(req) || '__IP_NOT_FOUND__'
}

export const rateLimit = rateLimitChecker()
