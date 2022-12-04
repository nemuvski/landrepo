import { resolve } from 'node:path'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppLoggerModule } from './logger/app-logger.module'
import { MailModule } from './mail/mail.module'
import type { ApolloDriverConfig } from '@nestjs/apollo'
import { AppController } from '$/app.controller'
import { AuthModule } from '$/auth/auth.module'
import {
  getEnvFilePaths,
  isDevelopmentEnv,
  validationEnvOptions,
  validationEnvSchema,
} from '$/common/helpers/env.helper'
import { DatabaseModule } from '$/database/database.module'
import { UsersModule } from '$/users/users.module'
import { UsersService } from '$/users/users.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
      validationSchema: validationEnvSchema,
      validationOptions: validationEnvOptions,
    }),
    AppLoggerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/gql',
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
    MailModule,
  ],
  controllers: [AppController],
  providers: [UsersService],
})
export class AppModule {}
