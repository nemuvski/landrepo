import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from '$/auth/auth.resolver'
import { AuthService } from '$/auth/auth.service'
import { JwtRefreshStrategy } from '$/auth/jwt-refresh.strategy'
import { JwtStrategy } from '$/auth/jwt.strategy'
import { LocalStrategy } from '$/auth/local.strategy'
import { TokenService } from '$/auth/token.service'
import { DatabaseService } from '$/database/database.service'
import { MailModule } from '$/mail/mail.module'
import { UsersModule } from '$/users/users.module'

@Module({
  imports: [UsersModule, PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({}), MailModule],
  providers: [AuthService, TokenService, DatabaseService, AuthResolver, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
