import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { getEnvFilePaths, validateEnv } from '$config/environments'
import { AppController } from '$core/app.controller'
import { AuthModule } from '$core/auth/auth.module'
import { UsersModule } from '$core/users/users.module'
import { UsersService } from '$core/users/users.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
      validate: validateEnv,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [UsersService],
})
export class AppModule {}