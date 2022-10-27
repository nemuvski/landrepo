import { NestFactory } from '@nestjs/core'
import { AppModule } from '$/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // TODO: 必要に応じて有効にすること
  // app.enableCors()
  await app.listen(4000)
}

bootstrap()
