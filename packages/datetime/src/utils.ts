import { isDayjs } from 'dayjs'
import ms from 'ms'
import type { DateTime } from './libs'

/**
 * DateTimeオブジェクトの場合はTrueを返却する
 *
 * @param value
 */
export function isDateTimeObject(value: unknown): value is DateTime {
  return isDayjs(value)
}

/**
 * 時刻形式の文字列の内容からミリ秒を求めて返却する
 *
 * ※形式に誤りがある場合はundefined
 *
 * @param timeFormatStr '7d' といった形式の文字列
 * @see {@link https://github.com/vercel/ms}
 */
export function getMilliSeconds(timeFormatStr: string): number | undefined {
  return ms(timeFormatStr)
}

/**
 * 時刻形式の文字列の内容から秒を求めて返却する
 *
 * ※形式に誤りがある場合はundefined
 *
 * @param timeFormatStr '7d' といった形式の文字列
 * @see {@link https://github.com/vercel/ms}
 */
export function getSeconds(timeFormatStr: string): number | undefined {
  const msec = getMilliSeconds(timeFormatStr)
  if (msec === undefined) {
    return undefined
  }
  return Math.floor(msec / 1000)
}
