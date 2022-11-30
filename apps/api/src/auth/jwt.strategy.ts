import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtStrategyValidationReturnType } from '$/auth/types/strategy.type'
import type { JwtPayload } from '@project/jwt'
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
      ...payload,
      user,
    }
  }
}
