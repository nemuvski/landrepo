export const AuthErrorMessage = {
  UserNotFound: 'user not found',
} as const

export type AuthErrorMessageType = typeof AuthErrorMessage[keyof typeof AuthErrorMessage]
