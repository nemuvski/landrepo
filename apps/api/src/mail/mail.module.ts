import { join } from 'node:path'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { MailerOptions } from '@nestjs-modules/mailer'
import { isDevelopmentEnv } from '$/common/helpers/env.helper'
import { MailService } from '$/mail/mail.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: MailerOptions = {
          defaults: {
            from: `"No reply" <noreply@example.com>`,
          },
          transport: {
            host: configService.get<string>('NEST_MAILER_TRANSPORT_SMTP_HOST'),
            port: configService.get<number>('NEST_MAILER_TRANSPORT_SMTP_PORT'),
            secure: !isDevelopmentEnv(),
            ignoreTLS: isDevelopmentEnv(),
            auth: {
              user: configService.get<string>('NEST_MAILER_TRANSPORT_INCOMING_USER'),
              pass: configService.get<string>('NEST_MAILER_TRANSPORT_INCOMING_PASSWORD'),
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
        return options
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
