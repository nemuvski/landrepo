import { clientEnv } from '~/helpers/client-env.helper'

/**
 * developmentビルドの場合にTrueを返却する
 */
export function isDevelopmentEnv() {
  return clientEnv.NODE_ENV === 'development'
}
