/**
 * Authorizationヘッダーの値からトークン部分を取り出して返却する
 *
 * @param authorizationValue 'Bearer XXX.YYY.ZZZ' といった形式の内容
 * @example
 * // e.g. value = Bearer XXX.YYY.ZZZ
 * const value = context.req.headers.authorization
 * if (value) {
 *   // token = XXX.YYY.ZZZ
 *   const token = getTokenByAuthorizationHeader(value)
 * }
 */
export function getTokenByAuthorizationHeader(authorizationValue: string) {
  return authorizationValue.replace(/^\s*Bearer\s+/, '').trim()
}
