import { Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import type { ExecutionContext } from '@nestjs/common'

@Injectable()
export class JwtOneTimeGuard extends AuthGuard('jwt-one-time') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
