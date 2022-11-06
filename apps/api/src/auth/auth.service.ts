import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import type { JwtPayload } from '$/auth/interfaces/jwt-payload.interface'
import type { User } from '$generated/user/user.model'
import { comparePassword } from '$/common/helpers/crypto.helper'
import { UsersService } from '$/users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUnique({ where: { email } })
    if (user) {
      const isMatched = await comparePassword(password, user.password)
      if (isMatched) {
        return user
      }
    }
    // ユーザーが存在しない、またはパスワードが合わない場合はnullを返却
    return null
  }

  async signIn(user: User) {
    // ここない
    console.log('AuthService.signIn', user)
    const payload: JwtPayload = { email: user.email, sub: user.id }
    const result: SignInUserResponse = {
      access_token: this.jwtService.sign(payload),
      user,
    }
    return result
  }
}
