import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthErrorMessage } from '@project/api-error'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtStrategyValidateReturnType } from '$/auth/types/strategy.type'
import type { JwtPayload } from '@project/auth'
import { TokenService } from '$/auth/token.service'
import { UsersService } from '$/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') implements IPassportJwtStrategy {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tokenService: TokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('NEST_JWT_SECRET_KEY'),
    })
  }

  async validate(payload: JwtPayload): Promise<JwtStrategyValidateReturnType> {
    const user = await this.usersService.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException(AuthErrorMessage.UserNotFound)
    }
    if (!this.usersService.isActiveUser(user)) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidUser)
    }
    const session = await this.tokenService.findUniqueRefreshToken({
      where: { id_userId: { id: payload.sid, userId: payload.sub } },
    })
    if (!session) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidSession)
    }
    /**
     * NOTE: 返値はContextに含まれる
     */
    return {
      ...payload,
      user,
      refreshToken: session,
    }
  }
}
