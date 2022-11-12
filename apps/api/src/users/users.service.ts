import { Injectable } from '@nestjs/common'
import type { CreateOneUserArgs, FindUniqueUserArgs } from '$/nestgraphql'
import { hashingPassword } from '$/common/helpers/crypto.helper'
import { DatabaseService } from '$/database/database.service'

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findUnique(args: FindUniqueUserArgs) {
    return this.databaseService.user.findUnique(args)
  }

  async create(args: CreateOneUserArgs) {
    args.data.password = await hashingPassword(args.data.password)
    return this.databaseService.user.create(args)
  }
}
