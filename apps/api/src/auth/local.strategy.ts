import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import type { IPassportLocalStrategy } from '$/auth/interfaces/passport-strategy.interface'
import type { LocalStrategyValidateReturnType } from '$/auth/types/strategy.type'
import { AuthService } from '$/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements IPassportLocalStrategy {
  constructor(private authService: AuthService) {
    /**
     * NOTE: デフォルトではusernameフィールドとpasswordフィールドを扱うがusernameフィールドにemailフィールドを参照するように指定している
     *
     * @see {SignInUserInput} フィールド名は揃える
     */
    super({ usernameField: 'email', passwordField: 'password' })
  }

  async validate(email: string, password: string): Promise<LocalStrategyValidateReturnType> {
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException('対象のユーザーが存在しません')
    }
    return user
  }
}
