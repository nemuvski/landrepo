import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from '$/auth/auth.resolver'
import { AuthService } from '$/auth/auth.service'
import { JwtOneTimeStrategy } from '$/auth/jwt-one-time.strategy'
import { JwtRefreshStrategy } from '$/auth/jwt-refresh.strategy'
import { JwtStrategy } from '$/auth/jwt.strategy'
import { LocalStrategy } from '$/auth/local.strategy'
import { TokenService } from '$/auth/token.service'
import { MailModule } from '$/mail/mail.module'
import { UsersModule } from '$/users/users.module'

@Module({
  imports: [UsersModule, PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({}), MailModule],
  providers: [
    AuthService,
    TokenService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtOneTimeStrategy,
  ],
  exports: [AuthService, TokenService, JwtModule],
})
export class AuthModule {}
