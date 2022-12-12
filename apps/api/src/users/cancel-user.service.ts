import { Injectable } from '@nestjs/common'
import type Prisma from '$/prisma'
import { DatabaseService } from '$/database/database.service'

@Injectable()
export class CancelUserService {
  constructor(private databaseService: DatabaseService) {}

  async create(args: Prisma.CancelUserCreateArgs) {
    return this.databaseService.cancelUser.create(args)
  }
}
