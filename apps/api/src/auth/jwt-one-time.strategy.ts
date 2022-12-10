import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthErrorMessage } from '@project/api-error'
import { JwtOneTimePayloadUseField, type JwtOneTimePayload } from '@project/auth'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtOneTimeStrategyValidateReturnType } from '$/auth/types/strategy.type'
import { UsersService } from '$/users/users.service'

@Injectable()
export class JwtOneTimeStrategy
  extends PassportStrategy(Strategy, 'jwt-one-time')
  implements IPassportJwtStrategy<JwtOneTimePayload>
{
  constructor(private configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('NEST_JWT_ONE_TIME_SECRET_KEY'),
    })
  }

  async validate(payload: JwtOneTimePayload): Promise<JwtOneTimeStrategyValidateReturnType> {
    if (!this.validUseField(payload)) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidOneTimeToken)
    }
    const user = await this.usersService.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException(AuthErrorMessage.UserNotFound)
    }

    /**
     * SignUp用途の場合
     */
    if (payload.use === JwtOneTimePayloadUseField.SignUp) {
      if (!this.usersService.isTargetSignUpConfirmation(user)) {
        throw new UnauthorizedException(AuthErrorMessage.UserNonTargetSignUp)
      }
    }

    /**
     * ChangeEmail用途の場合
     */
    if (payload.use === JwtOneTimePayloadUseField.ChangeEmail) {
      if (!this.usersService.isTargetChangingEmailConfirmation(user)) {
        throw new UnauthorizedException(AuthErrorMessage.UserNonTargetChangingEmail)
      }
    }

    /**
     * ChangePassword用途の場合
     */
    if (payload.use === JwtOneTimePayloadUseField.ChangePassword) {
      if (!this.usersService.isTargetChangingPasswordConfirmation(user)) {
        throw new UnauthorizedException(AuthErrorMessage.UserNonTargetChangingPassword)
      }
    }

    /**
     * NOTE: 返値はContextに含まれる
     */
    return {
      ...payload,
      user,
    }
  }

  private validUseField(payload: JwtOneTimePayload) {
    const { use } = payload
    return (
      use === JwtOneTimePayloadUseField.SignUp ||
      use === JwtOneTimePayloadUseField.ChangeEmail ||
      use === JwtOneTimePayloadUseField.ChangePassword
    )
  }
}
