import { Injectable } from '@nestjs/common'
import type { UserModel } from '$core/users/models/user.model'

@Injectable()
export class UsersService {
  private readonly users: Array<UserModel> = [
    {
      id: '1',
      username: 'john',
      password: 'changeme',
    },
    {
      id: '2',
      username: 'maria',
      password: 'guess',
    },
  ]

  findOne(username: UserModel['username']) {
    return this.users.find((user) => user.username === username)
  }
}
