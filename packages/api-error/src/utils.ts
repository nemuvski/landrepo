import type { AuthErrorMessageType } from './error/auth'

type MessageType = AuthErrorMessageType

export function matchErrorMessage<T extends Error>(message: MessageType, error: T | null | undefined) {
  if (!error) {
    return false
  }
  return error.message === message
}

export function isErrorObject<T extends Error>(value: unknown, errorClassName: string = Error.name): value is T {
  return value instanceof Error && value.name === errorClassName
}
