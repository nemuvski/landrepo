import { Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ThrottlerGuard } from '@nestjs/throttler'
import { RateLimitingErrorMessage } from '@project/api-error'
import type { ExecutionContext, ContextType } from '@nestjs/common'
import TooManyRequestsException from '$/common/exceptions/too-many-requests.exception'

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context)
      const ctx = gqlCtx.getContext()
      return { req: ctx.req, res: ctx.res }
    } else {
      const http = context.switchToHttp()
      return { req: http.getRequest(), res: http.getResponse() }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  throwThrottlingException(context: ExecutionContext) {
    throw new TooManyRequestsException(RateLimitingErrorMessage.TooManyRequests)
  }
}
