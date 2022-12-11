import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TokenService } from '$/auth/token.service'
import { AppLoggerService } from '$/logger/app-logger.service'

@Injectable()
export class CronService {
  constructor(private appLoggerService: AppLoggerService, private tokenService: TokenService) {}

  /**
   * スケジューラーのタイムゾーン
   */
  static readonly TIMEZONE = 'Asia/Tokyo'

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'Prune refresh-tokens', timeZone: CronService.TIMEZONE })
  async pruneRefreshTokens() {
    this.appLoggerService.log('[Cron] pruneRefreshTokens() started')
    const count = await this.tokenService.pruneRefreshTokens()
    this.appLoggerService.log(`[Cron] pruneRefreshTokens() ${count} records deleted`)
    this.appLoggerService.log('[Cron] pruneRefreshTokens() done')
  }
}
