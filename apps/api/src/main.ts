import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '$/app.module'
import { isDevelopmentEnv } from '$/common/helpers/env.helper'
import { AppLoggerService } from '$/logger/app-logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: isDevelopmentEnv() ? ['log', 'error', 'warn', 'debug', 'verbose'] : false,
  })

  app.useLogger(app.get(AppLoggerService))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  // TODO: 必要に応じて有効にすること
  // app.enableCors()
  await app.listen(4000)
}

bootstrap()
