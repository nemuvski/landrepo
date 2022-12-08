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
export interface JwtPayloadBase {
  // 認証ユーザーを一意に特定するもの (UserテーブルのIDが相当する)
  sub: string
  // 失効する時刻 (UNIXタイム形式) ※JWT発行時にで自動付与される
  exp: number
  // 発行した時刻 (UNIXタイム形式)
  iat: number
  // JWT ID (JWTのユニーク性を担保するため)
  jti: string
}

export interface JwtPayload extends JwtPayloadBase {
  // セッションのID (RefreshTokenテーブルのIDが相当する)
  sid: string
  // ユーザーのロール
  role: UserRole
}

export interface JwtOneTimePayload extends JwtPayloadBase {
  // トークンの用途
  use: JwtOneTimePayloadUseFieldType
}

export const JwtOneTimePayloadUseField = {
  SignUp: 'sign-up',
  ChangePassword: 'change-password',
  ChangeEmail: 'change-email',
} as const
export type JwtOneTimePayloadUseFieldType = typeof JwtOneTimePayloadUseField[keyof typeof JwtOneTimePayloadUseField]

export interface Tokens {
  accessToken: string
  refreshToken: string

  // ISO date string
  accessTokenExpiresIn: string

  // ISO date string
  refreshTokenExpiresIn: string
}
