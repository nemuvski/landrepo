import { Module } from '@nestjs/common'
import { DatabaseService } from '$/database/database.service'
import { UsersResolver } from '$/users/users.resolver'
import { UsersService } from '$/users/users.service'

@Module({
  providers: [UsersService, UsersResolver, DatabaseService],
  exports: [UsersService],
})
export class UsersModule {}
