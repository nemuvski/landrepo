import { datetime } from '@project/datetime'
import { EXPIRY_MARGIN } from '~/modules/auth/constants'

/**
 * 引数isoDateStringが表す日付が更新タイミングである場合はTrueを返却する
 *
 * @param isoDateString
 */
export function mustReissueToken(isoDateString: string) {
  return datetime(isoDateString).diff(datetime(), 'ms') <= EXPIRY_MARGIN
}
