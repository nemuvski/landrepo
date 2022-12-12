export const AuthErrorMessage = {
  /**
   * Userレコードがない
   */
  UserNotFound: 'user not found',
  /**
   * サインアップやサインイン時にユーザーが確認済みではない
   */
  UserNotConfirmed: 'user not confirmed',
  /**
   * サインアップ時の確認フローで、既に確認済みである
   */
  UserAlreadyConfirmed: 'user already confirmed',
  /**
   * サインアップやメールアドレス変更時等で、Userレコードが存在する
   */
  UserAlreadyExists: 'user already exists',
  /**
   * サインアップ対象のユーザーではない
   */
  UserNonTargetSignUp: 'user non target sign up',
  /**
   * メールアドレス変更対象のユーザーではない
   */
  UserNonTargetChangingEmail: 'user non target changing email',
  /**
   * パスワード変更対象のユーザーではない
   */
  UserNonTargetChangingPassword: 'user non target changing password',
  /**
   * 新規登録時入力したメールアドレスが削除予定のユーザーが利用しているもの
   */
  EmailAddressCurrentlyUnavailable: 'email address currently unavailable',
  /**
   * パスワードが誤っている
   */
  PasswordIncorrect: 'password incorrect',
  /**
   * 無効なユーザー
   *
   * ※ ユーザーのステータスが有効でない
   */
  InvalidUser: 'invalid user',
  /**
   * 無効なセッション
   *
   * ※ RefreshTokenレコードがない
   */
  InvalidSession: 'invalid session',
  /**
   * 無効なワンタイムトークン
   */
  InvalidOneTimeToken: 'invalid one time token',
  /**
   * ヘッダーにAuthorizationがない
   *
   * ※ context経由で取得したAuthorizationヘッダー値がないといったケース
   */
  NoAuthority: 'no authority',
  /**
   * パスワードの有効条件を満たしていない
   *
   * ※ 長さが上限値を超えた等
   */
  InvalidPasswordFormat: 'invalid password format',
  /**
   * 確認メールの再送信の間隔制限
   */
  RestrictedSendingConfirmationEmail: 'restricted sending confirmation email',
} as const

export type AuthErrorMessageType = typeof AuthErrorMessage[keyof typeof AuthErrorMessage]
