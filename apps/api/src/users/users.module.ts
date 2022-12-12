import { Module } from '@nestjs/common'
import { CancelUserService } from '$/users/cancel-user.service'
import { UsersResolver } from '$/users/users.resolver'
import { UsersService } from '$/users/users.service'

@Module({
  providers: [UsersService, UsersResolver, CancelUserService],
  exports: [UsersService, CancelUserService],
})
export class UsersModule {}
