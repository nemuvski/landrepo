import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtPayload } from '$/auth/types/jwt-payload.type'
import type { JwtRefreshStrategyValidationReturnType } from '$/auth/types/strategy.type'
import { TokenService } from '$/auth/token.service'
import { UsersService } from '$/users/users.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') implements IPassportJwtStrategy {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tokenService: TokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('NEST_JWT_REFRESH_SECRET_KEY'),
    })
  }

  async validate(payload: JwtPayload): Promise<JwtRefreshStrategyValidationReturnType> {
    const user = await this.usersService.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException()
    }
    const refreshToken = await this.tokenService.fineUniqueRefreshToken({
      where: { id_userId: { id: payload.sid, userId: payload.sub } },
    })
    if (!refreshToken) {
      throw new UnauthorizedException()
    }
    return {
      userEntity: user,
      refreshTokenEntity: refreshToken,
    }
  }
}
