import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { IPassportJwtStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { JwtStrategyValidationReturnType } from '$/auth/types/strategy.type'
import type { JwtOneTimePayload } from '@project/jwt'
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

  async validate(payload: JwtOneTimePayload): Promise<JwtStrategyValidationReturnType<JwtOneTimePayload>> {
    const user = await this.usersService.findUnique({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException()
    }

    // TODO: payload.useによって検証方法を分ける

    /**
     * NOTE: 返値はContextに含まれる
     */
    return {
      ...payload,
      user,
    }
  }
}
