import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '$/app.module'
import { getSiteUrlOrigin, isDevelopmentEnv } from '$/common/helpers/env.helper'
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

  /**
   * NOTE: GraphQLエンドポイントについてのCORSはGraphQLModuleの設定に記載する
   *
   * @see {@link https://docs.nestjs.com/security/cors}
   * @see {@link https://github.com/expressjs/cors#configuration-options}
   */
  app.enableCors({
    origin: getSiteUrlOrigin(),
    credentials: true,
    maxAge: 3600,
  })

  await app.listen(4000)
}

bootstrap()
