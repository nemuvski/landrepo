import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { getEnvFilePaths, validateEnv } from '$config/environments'
import { AuthModule } from '$core/auth/auth.module'
import { UsersService } from '$core/users/users.service'

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
