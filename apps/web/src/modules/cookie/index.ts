import { isDevelopmentEnv } from '~/helpers/env.helper'
import type { CookieSerializeOptions } from 'cookie'

export const defaultCookieOptions: CookieSerializeOptions = {
  secure: !isDevelopmentEnv(),
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
}
