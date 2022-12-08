import { Catch, HttpException } from '@nestjs/common'
import type { ArgumentsHost, ExceptionFilter, ContextType } from '@nestjs/common'
import { AppLoggerService } from '$/logger/app-logger.service'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private appLoggerService: AppLoggerService) {}

  /**
   * @see {import('@nestjs/core/helpers/execution-context-host').ExecutionContextHost} host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    this.appLoggerService.error(JSON.stringify(exception), exception.stack)

    if (host.getType<ContextType | 'graphql'>() === 'graphql') {
    }

    return exception
  }
}
