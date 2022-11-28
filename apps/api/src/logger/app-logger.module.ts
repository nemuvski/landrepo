import { Module } from '@nestjs/common'
import { AppLoggerService } from './app-logger.service'

@Module({
  providers: [AppLoggerService],
})
export class AppLoggerModule {}
