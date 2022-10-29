import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from '$core/auth/auth.service'
import { LocalStrategy } from '$core/auth/local.strategy'
import { UsersModule } from '$core/users/users.module'

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
