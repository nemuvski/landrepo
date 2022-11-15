import { Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import type { SignInUserInput } from '$/auth/dto/sign-in-user.input'
import type { ExecutionContext } from '@nestjs/common'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext()
    if (request) {
      /**
       * @see {AuthResolver.signIn}
       */
      const { input } = ctx.getArgs<{ input: SignInUserInput }>()
      /**
       * `LocalStrategy` にemail,passwordを渡すためにパラメータをマッピング
       *
       * @see {LocalStrategy}
       */
      request.body = input
    }
    return request
  }
}
