import { resolve } from 'node:path'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'
import { CronModule } from './cron/cron.module'
import { AppLoggerModule } from './logger/app-logger.module'
import { MailModule } from './mail/mail.module'
import type { ApolloDriverConfig } from '@nestjs/apollo'
import { AppController } from '$/app.controller'
import { AuthModule } from '$/auth/auth.module'
import { HttpExceptionFilter } from '$/common/filters/http-exception.filter'
import {
  getEnvFilePaths,
  getSiteUrlOrigin,
  isDevelopmentEnv,
  validationEnvOptions,
  validationEnvSchema,
} from '$/common/helpers/env.helper'
import { AccessLoggingInterceptor } from '$/common/interceptors/access-logging.interceptor'
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
      /**
       * @see {@link https://docs.nestjs.com/security/cors}
       * @see {@link https://github.com/expressjs/cors#configuration-options}
       */
      cors: {
        origin: getSiteUrlOrigin(),
        credentials: true,
        maxAge: 3600,
      },
    }),
    ScheduleModule.forRoot(),
    MailModule,
    CronModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: AccessLoggingInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    UsersService,
  ],
})
export class AppModule {}
