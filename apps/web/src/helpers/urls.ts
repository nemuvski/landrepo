import { buildPath, withTrailingSlash } from '@itsumono/utils'
import { clientEnv } from '~/helpers/client-env'

/**
 * サイトのURLを返却する
 *
 * @param path 結合するパス
 */
export function getSiteUrlWithPath(path?: string) {
  return withTrailingSlash(buildPath(clientEnv.NEXT_PUBLIC_BASE_URL, path))
}
