import { resolve } from 'node:path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from '$core/app.controller'
import { AuthModule } from '$core/auth/auth.module'
import { getEnvFilePaths, isDevelopmentEnv, validateEnv } from '$core/common/helpers/env.helper'
import { DatabaseModule } from '$core/database/database.module'
import { UsersModule } from '$core/users/users.module'
import { UsersService } from '$core/users/users.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
      validate: validateEnv,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: isDevelopmentEnv(),
      debug: isDevelopmentEnv(),
      // NOTE: schemaファイルを出力するパスに相当
      autoSchemaFile: resolve(__dirname, '..', 'schema.graphql'),
      sortSchema: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [UsersService],
})
export class AppModule {}
