import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '$/auth/auth.module'
import { getEnvFilePaths, validateEnv } from '$/helpers/environments'
import { UsersService } from '$/users/users.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
      validate: validateEnv,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
