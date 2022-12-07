import { isString } from '@itsumono/utils'
import type Prisma from '$/prisma'

export function normalizedStringFieldUpdateOperationsInput<T extends string | Prisma.StringFieldUpdateOperationsInput>(
  fieldValue: T
) {
  if (isString(fieldValue)) {
    return { set: fieldValue }
  }
  return { set: fieldValue.set }
}

export function normalizedNullableStringFieldUpdateOperationsInput<
  T extends string | Prisma.NullableStringFieldUpdateOperationsInput
>(fieldValue: T) {
  if (isString(fieldValue)) {
    return { set: fieldValue }
  }
  return { set: fieldValue.set }
}
