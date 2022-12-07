import { Module } from '@nestjs/common'
import { UsersResolver } from '$/users/users.resolver'
import { UsersService } from '$/users/users.service'

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
