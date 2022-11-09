import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@project/database'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
