/**
 * アクセストークンの有効期限
 *
 * @see {@link https://github.com/vercel/ms}
 */
export const JWT_TOKEN_EXPIRES_IN = '15m'

/**
 * リフレッシュトークンの有効期限
 *
 * @see {@link https://github.com/vercel/ms}
 */
export const JWT_REFRESH_TOKEN_EXPIRES_IN = '7d'

/**
 * ユーザーの確認時などで利用するワンタイムトークンの有効期限
 *
 * @see {@link https://github.com/vercel/ms}
 */
export const JWT_ONE_TIME_TOKEN_EXPIRES_IN = '30m'
