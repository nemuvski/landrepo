export const UserErrorMessage = {
  /**
   * パスワードの有効条件を満たしていない
   *
   * ※ 長さが上限値を超えた等
   */
  InvalidPasswordFormat: 'invalid password format',
} as const

export type UserErrorMessageType = typeof UserErrorMessage[keyof typeof UserErrorMessage]
