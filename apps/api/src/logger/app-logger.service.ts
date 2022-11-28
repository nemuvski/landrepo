import { Injectable } from '@nestjs/common'
import * as Winston from 'winston'
import 'winston-daily-rotate-file'
import type { LoggerService } from '@nestjs/common'
import { isDevelopmentEnv } from '$/common/helpers/env.helper'

@Injectable()
export class AppLoggerService implements LoggerService {
  logger: Winston.Logger

  constructor() {
    const logger = Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // エラー時はスタックトレースを出力する
        Winston.format.errors({ stack: true }),
        Winston.format.printf((info) => {
          return `[${info.timestamp}] {${info.level.toUpperCase()}} ${info.message}`
        })
      ),
      transports: [
        // アクセスログの出力先
        new Winston.transports.DailyRotateFile({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          filename: 'access.%DATE%.log',
          dirname: 'logs',
          maxSize: '10m',
          maxFiles: '30d',
        }),
        // エラーログの出力先
        new Winston.transports.DailyRotateFile({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          filename: 'error.%DATE%.log',
          dirname: 'logs',
          maxSize: '10m',
          maxFiles: '30d',
        }),
      ],
    })

    // 開発モードの場合はコンソールにも出力する
    if (isDevelopmentEnv()) {
      logger.add(
        new Winston.transports.Console({
          level: 'debug',
          format: Winston.format.combine(Winston.format.colorize(), Winston.format.simple()),
        })
      )
    }

    this.logger = logger
  }

  log(message: string) {
    this.logger.log({
      level: 'info',
      message: `${message}`,
    })
  }

  error(message: string, trace: string) {
    this.logger.log({
      level: 'error',
      message: `${message}:${trace}`,
    })
  }

  warn(message: string) {
    this.logger.log({
      level: 'warn',
      message: `${message}`,
    })
  }

  debug(message: string) {
    this.logger.log({
      level: 'debug',
      message: `${message}`,
    })
  }

  verbose(message: string) {
    this.logger.log({
      level: 'verbose',
      message: `${message}`,
    })
  }
}
