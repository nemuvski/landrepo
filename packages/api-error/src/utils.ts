import type { AuthErrorMessageType } from './error/auth'

type MessageType = AuthErrorMessageType

export function matchErrorMessage<T extends Error>(message: MessageType, error: T | null | undefined) {
  if (!error) {
    return false
  }
  /**
   * CombinedErrorだとプレフィックスにエラー元の情報がのるので、それを除く
   * @see {@link https://formidable.com/open-source/urql/docs/api/core/#combinederror}
   */
  return error.message.replace(/^\[graphql\]/i, '').trim() === message
}

export function isErrorObject<T extends Error>(value: unknown, errorClassName: string = Error.name): value is T {
  return value instanceof Error && value.name === errorClassName
}
