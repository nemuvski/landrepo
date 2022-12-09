import { getJwtPayload } from '@project/auth'
import { datetime } from '@project/datetime'
import { EXPIRY_MARGIN } from '~/modules/auth/constants'
import type { JwtOneTimePayload } from '@project/auth'
import type { Session } from '~/modules/auth/index'

/**
 * 引数isoDateStringが表す日付が更新タイミングである場合はTrueを返却する
 *
 * @param isoDateString
 */
export function mustReissueToken(isoDateString: string) {
  return datetime(isoDateString).diff(datetime(), 'ms') <= EXPIRY_MARGIN
}

/**
 * ワンタイムトークンが自身のものである場合はTrueを返却する
 *
 * @param oneTimeToken
 * @param session
 */
export function isOwnOneTimeToken(oneTimeToken: string, session: Session) {
  const payload = getJwtPayload<JwtOneTimePayload>(oneTimeToken)
  return payload?.sub === session.user.id
}
