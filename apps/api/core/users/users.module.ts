import { Module } from '@nestjs/common'
import { UsersResolver } from '$core/users/users.resolver'
import { UsersService } from '$core/users/users.service'

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
