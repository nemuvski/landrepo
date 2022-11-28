import { Global, Module } from '@nestjs/common'
import { AppLoggerService } from './app-logger.service'

@Global()
@Module({
  providers: [AppLoggerService],
})
export class AppLoggerModule {}
