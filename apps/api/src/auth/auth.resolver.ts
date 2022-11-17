import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from '$/auth/auth.service'
import { SignInUserInput } from '$/auth/dto/sign-in-user.input'
import { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import { JwtRefreshAuthGuard } from '$/auth/jwt-refresh-auth.guard'
import { LocalAuthGuard } from '$/auth/local-auth.guard'
import { WithJwtAuthGuardContext, WithLocalAuthGuardContext } from '$/common/types/context.type'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInUserResponse)
  @UseGuards(LocalAuthGuard)
  async signIn(@Args('input') input: SignInUserInput, @Context() context: WithLocalAuthGuardContext) {
    return this.authService.signIn(context.user)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  async signOut(@Context() context: WithJwtAuthGuardContext) {
    const { id, sid } = context.req.user
    return this.authService.signOut(id, sid)
  }

  @Mutation(() => SignInUserResponse)
  @UseGuards(JwtRefreshAuthGuard)
  reissueTokens(@Context() context: WithJwtAuthGuardContext) {
    const { sid, ...user } = context.req.user
    /**
     * JwtRefreshAuthGuardで保護しているため、authorizationValueが空というケースは考えられないが
     * サービスのメソッドにて、値がundefinedであるケースはケアしておくこと
     *
     * @see {JwtRefreshAuthGuard}
     */
    const authorizationValue = context.req.headers.authorization
    return this.authService.reissueTokens(user, sid, authorizationValue)
  }
}
