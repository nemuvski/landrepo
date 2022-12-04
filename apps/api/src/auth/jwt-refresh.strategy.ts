import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtStrategyValidationReturnType } from '$/auth/types/strategy.type'
import type { JwtPayload } from '@project/auth'
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

  async validate(payload: JwtPayload): Promise<JwtStrategyValidationReturnType> {
    const user = await this.usersService.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException('対象のユーザーが存在しません')
    }
    if (!this.usersService.isActiveUser(user)) {
      throw new UnauthorizedException('有効なユーザーではありません')
    }

    const session = await this.tokenService.findUniqueRefreshToken({
      where: { id_userId: { id: payload.sid, userId: payload.sub } },
    })
    if (!session) {
      throw new UnauthorizedException('無効なセッションです')
    }
    /**
     * NOTE: 返値はContextに含まれる
     */
    return {
      ...payload,
      user,
    }
  }
}
