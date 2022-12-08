import { Injectable } from '@nestjs/common'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import { AppLoggerService } from '$/logger/app-logger.service'

@Injectable()
export class AccessLoggingInterceptor implements NestInterceptor {
  constructor(private appLoggerService: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const requestInfo = {
      ip: request.ip,
      method: request.method,
      url: request.url,
      body: request.body || {},
    }

    this.appLoggerService.log(JSON.stringify(requestInfo))

    return next.handle()
  }
}
