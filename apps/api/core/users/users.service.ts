import { Injectable } from '@nestjs/common'

export interface UserEntity {
  id: number
  username: string
  password: string
}

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
