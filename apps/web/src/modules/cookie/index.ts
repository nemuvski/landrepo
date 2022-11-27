import type { CookieSerializeOptions } from 'cookie'

export const defaultCookieOptions: CookieSerializeOptions = {
  secure: true,
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
}
