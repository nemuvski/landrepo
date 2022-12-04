import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from '$/auth/auth.service'
import { SignInUserInput } from '$/auth/dto/sign-in-user.input'
import { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import { SignUpUserInput } from '$/auth/dto/sign-up-user.input'
import { VerifySessionResponse } from '$/auth/dto/verify-session.response'
import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { JwtRefreshAuthGuard } from '$/auth/jwt-refresh-auth.guard'
import { LocalAuthGuard } from '$/auth/local-auth.guard'
import { WithJwtAuthGuardContext, WithLocalAuthGuardContext } from '$/common/types/context.type'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  async signUp(@Args('input') input: SignUpUserInput) {
    return this.authService.signUp(input.email, input.password, input.role)
  }

  @Mutation(() => SignInUserResponse)
  @UseGuards(LocalAuthGuard)
  async signIn(@Args('input') input: SignInUserInput, @Context() context: WithLocalAuthGuardContext) {
    return this.authService.signIn(context.user)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  async signOut(@Context() context: WithJwtAuthGuardContext) {
    const {
      user: { id },
      sid,
    } = context.req.user
    return this.authService.signOut(id, sid)
  }

  @Mutation(() => VerifySessionResponse)
  @UseGuards(JwtAuthGuard)
  async verifySession(@Context() context: WithJwtAuthGuardContext) {
    const { exp, user } = context.req.user
    return this.authService.verifySession(user, exp)
  }

  @Mutation(() => SignInUserResponse)
  @UseGuards(JwtRefreshAuthGuard)
  reissueTokens(@Context() context: WithJwtAuthGuardContext) {
    const { sid, user } = context.req.user
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
