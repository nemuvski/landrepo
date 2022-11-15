import type { UserRole } from '@project/database'

/**
 * NOTE: 必要なクレームフィールドを定義
 *
 * {
 *   iss // Issuer クレーム
 *   sub // Subject クレーム
 *   aud // Audience クレーム
 *   exp // Expiration Time クレーム
 *   nbf // Not Before クレーム
 *   iat // Issued At クレーム
 *   jti // JWT ID クレーム
 * }
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1}
 */
interface JwtPayloadBase {
  // 認証ユーザーを一意に特定するもの (UserのIDが相当する)
  sub: string
  // 発行した時刻 (UNIXタイム形式)
  iat: number
}

export interface JwtPayload extends JwtPayloadBase {
  // セッションのID (RefreshTokenテーブルのIDが相当する)
  sid: string
  // ユーザーのロール
  role: UserRole
}
