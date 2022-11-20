import { clientEnv } from '~/helpers/client-env.helper'

/**
 * クライアントサイドで参照する環境変数
 *
 * @see {NodeJS.ProcessEnv}
 */
export const serverEnv = {
  ...clientEnv,
}
