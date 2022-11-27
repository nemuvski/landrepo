/**
 * アクセストークンを格納しておくクッキー名
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes}
 */
export const COOKIE_NAME_ACCESS_TOKEN = '__app-acc-tkn' as const

/**
 * リフレッシュトークンを格納しておくクッキー名
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes}
 */
export const COOKIE_NAME_REFRESH_TOKEN = '__app-ref-tkn' as const

/**
 * トークン失効をチェックする間隔[ms]
 *
 * @see {import('@project/jwt').JWT_TOKEN_EXPIRES_IN} 設定する時間はトークンの有効期限よりも短くすること
 */
export const CHECK_VALID_TOKEN_INTERVAL = 20000 as const

/**
 * トークン再発行が必要かのチェックする際のマージン[ms]
 */
export const EXPIRY_MARGIN = 60000 as const
