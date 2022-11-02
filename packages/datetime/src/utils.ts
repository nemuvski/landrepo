import { isDayjs } from 'dayjs'
import type { DateTime } from './libs'

export function isDateTimeObject(value: unknown): value is DateTime {
  return isDayjs(value)
}
