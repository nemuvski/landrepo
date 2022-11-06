import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '$/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    /**
     * NOTE: デフォルトではusernameフィールドとpasswordフィールドを扱うがusernameフィールドにemailフィールドを参照するように指定している
     *
     * @see {SignInUserInput} フィールド名は揃える
     */
    super({ usernameField: 'email', passwordField: 'password' })
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
