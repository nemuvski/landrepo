import { INTERVAL_LIMIT_SENDING_CONFIRMATION_EMAIL } from '@project/auth'
import { datetime, getSeconds } from '@project/datetime'

/**
 * 再度確認メールを送信する際の時間制限がかかっている場合はTrueを返却する
 *
 * @param sentAt
 * @param timeFormatStr
 */
export function isRestrictedSendingConfirmationEmail(
  sentAt: Date,
  timeFormatStr: string = INTERVAL_LIMIT_SENDING_CONFIRMATION_EMAIL
) {
  const rateLimitSec = getSeconds(timeFormatStr) ?? 0
  return datetime().diff(datetime(sentAt), 's') <= rateLimitSec
}
