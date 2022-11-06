import { resolve } from 'node:path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from '$/app.controller'
import { AuthModule } from '$/auth/auth.module'
import { getEnvFilePaths, isDevelopmentEnv, validateEnv } from '$/common/helpers/env.helper'
import { DatabaseModule } from '$/database/database.module'
import { UsersModule } from '$/users/users.module'
import { UsersService } from '$/users/users.service'

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
      autoSchemaFile: resolve(process.cwd(), 'schema.graphql'),
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