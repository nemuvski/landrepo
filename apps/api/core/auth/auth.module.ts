import { Module } from '@nestjs/common'
import { AuthService } from '$core/auth/auth.service'

@Module({
  providers: [AuthService],
})
export class AuthModule {}
