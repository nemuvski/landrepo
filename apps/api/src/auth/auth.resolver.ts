import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '$nestgraphql/user/user.model'
import { AuthService } from '$/auth/auth.service'
import { SignInUserInput } from '$/auth/dto/sign-in-user.input'
import { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import { LocalAuthGuard } from '$/auth/local-auth.guard'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  /**
   * 1. `@UseGuards(LocalAuthGuard)`がLocalStrategyのvalidateを実行
   * 2. LocalStrategyのvalidateがAuthService.validateUser()を実行して、メールアドレスとパスワードをチェック
   * 3. 認証された(合致した)Userを`context`中の`user`フィールドに渡す
   *
   * @see {AuthService.validateUser}
   */
  @Mutation(() => SignInUserResponse)
  @UseGuards(LocalAuthGuard)
  async signIn(@Args('input') input: SignInUserInput, @Context() context: { user: User }) {
    return this.authService.signIn(context.user)
  }
}
