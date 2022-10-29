import { Injectable } from '@nestjs/common'
import { UsersService } from '$core/users/users.service'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  validateUser(username: string, password: string) {
    const user = this.userService.findOne(username)
    if (user && user.password === password) {
      const { password, ...results } = user
      return results
    }
    return null
  }
}
