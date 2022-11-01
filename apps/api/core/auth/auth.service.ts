import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { UserModel } from '$core/users/models/user.model'
import { JwtPayload } from '$core/auth/interfaces/jwt-payload.interface'
import { UsersService } from '$core/users/users.service'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  validateUser(username: string, password: string) {
    const user = this.userService.findOne(username)
    if (user && user.password === password) {
      const { password, ...results } = user
      return results
    }
    return null
  }

  login(user: UserModel) {
    const payload: JwtPayload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
