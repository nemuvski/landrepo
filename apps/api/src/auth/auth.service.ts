import { Injectable } from '@nestjs/common'

export interface UserEntity {
  id: string
  username: string
  password: string
}

@Injectable()
export class AuthService {}
