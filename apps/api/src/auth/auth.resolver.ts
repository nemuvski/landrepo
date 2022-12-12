import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from '$/auth/auth.service'
import { CancelServiceInput } from '$/auth/dto/cancel-service.input'
import { ChangePasswordInput } from '$/auth/dto/change-password.input'
import { ClaimChangingOwnEmailInput } from '$/auth/dto/claim-changing-email.input'
import { ClaimChangingPasswordInput } from '$/auth/dto/claim-changing-password.input'
import { SignInUserInput } from '$/auth/dto/sign-in-user.input'
import { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import { SignUpUserInput } from '$/auth/dto/sign-up-user.input'
import { VerifySessionResponse } from '$/auth/dto/verify-session.response'
import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { JwtOneTimeGuard } from '$/auth/jwt-one-time.guard'
import { JwtRefreshAuthGuard } from '$/auth/jwt-refresh-auth.guard'
import { LocalAuthGuard } from '$/auth/local-auth.guard'
import {
  WithJwtAuthGuardContext,
  WithJwtOneTimeGuardContext,
  WithLocalAuthGuardContext,
} from '$/common/types/context.type'

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
    const { user, refreshToken } = context.req.user
    // NOTE: Guardで事前チェックしているので、typeエラー回避
    const authorizationValue = context.req.headers.authorization ?? ''
    return this.authService.reissueTokens(user, refreshToken, authorizationValue)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtOneTimeGuard)
  async verifyTokenAtSignUp(@Context() context: WithJwtOneTimeGuardContext) {
    const { user } = context.req.user
    const authorizationValue = context.req.headers.authorization
    return this.authService.verifyTokenAtSignUp(user, authorizationValue)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async claimChangingOwnEmail(
    @Args('input') input: ClaimChangingOwnEmailInput,
    @Context() context: WithJwtAuthGuardContext
  ) {
    const { user } = context.req.user
    return this.authService.claimChangingOwnEmail(user, input.newEmail)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtOneTimeGuard)
  async verifyTokenAtChangeEmail(@Context() context: WithJwtOneTimeGuardContext) {
    const { user } = context.req.user
    // NOTE: Guardで事前チェックしているので、typeエラー回避
    const authorizationValue = context.req.headers.authorization ?? ''
    return this.authService.verifyTokenAtChangeEmail(user, authorizationValue)
  }

  @Mutation(() => Boolean)
  async claimChangingPassword(@Args('input') input: ClaimChangingPasswordInput) {
    return this.authService.claimChangingPassword(input.email)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtOneTimeGuard)
  async verifyTokenAtChangePassword(@Context() context: WithJwtOneTimeGuardContext) {
    const { user } = context.req.user
    // NOTE: Guardで事前チェックしているので、typeエラー回避
    const authorizationValue = context.req.headers.authorization ?? ''
    return this.authService.verifyTokenAtChangePassword(user, authorizationValue)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtOneTimeGuard)
  async changePassword(@Args('input') input: ChangePasswordInput, @Context() context: WithJwtOneTimeGuardContext) {
    const { user } = context.req.user
    // NOTE: Guardで事前チェックしているので、typeエラー回避
    const authorizationValue = context.req.headers.authorization ?? ''
    const isValid = await this.authService.verifyTokenAtChangePassword(user, authorizationValue)
    if (isValid) {
      await this.authService.changePassword(user, input.newPassword)
    }
    return true
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  async cancelService(@Args('input') input: CancelServiceInput, @Context() context: WithJwtAuthGuardContext) {
    const { user, refreshToken } = context.req.user
    // NOTE: Guardで事前チェックしているので、typeエラー回避
    const authorizationValue = context.req.headers.authorization ?? ''
    return this.authService.cancelService(user, refreshToken, authorizationValue, input)
  }
}
