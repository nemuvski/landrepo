import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@project/database'
import type { OnModuleInit, INestApplication } from '@nestjs/common'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
