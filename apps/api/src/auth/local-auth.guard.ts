import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import type { SignInUserInput } from '$/auth/dto/sign-in-user.input'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext()
    /**
     * @see {AuthResolver.signIn}
     */
    const { input } = ctx.getArgs<{ input: SignInUserInput }>()
    request.body = input
    return request
  }
}
