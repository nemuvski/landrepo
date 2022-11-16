import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtPayload } from '$/auth/types/jwt-payload.type'
import type { JwtStrategyValidationReturnType } from '$/auth/types/strategy.type'
import { UsersService } from '$/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') implements IPassportJwtStrategy {
  constructor(private configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('NEST_JWT_SECRET_KEY'),
    })
  }

  async validate(payload: JwtPayload): Promise<JwtStrategyValidationReturnType> {
    const user = await this.usersService.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException()
    }
    /**
     * NOTE: 返値はContextに含まれる
     */
    return {
      ...user,
      sid: payload.sid,
    }
  }
}
