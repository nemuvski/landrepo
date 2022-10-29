import { Injectable } from '@nestjs/common'
import { UserEntity } from '$core/users/entities/user.entity'

@Injectable()
export class UsersService {
  private readonly users: Array<UserEntity> = [
    {
      id: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      id: 2,
      username: 'maria',
      password: 'guess',
    },
  ]

  findOne(username: UserEntity['username']) {
    return this.users.find((user) => user.username === username)
  }
}
