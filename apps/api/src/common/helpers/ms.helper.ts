import ms from 'ms'

/**
 * 時刻形式の文字列の内容からミリ秒を求めて返却する
 *
 * ※形式に誤りがある場合はundefined
 *
 * @param timeFormatString '7d' といった形式の文字列
 * @see {@link https://github.com/vercel/ms}
 */
export function getMilliSecondsFromTimeFormatString(timeFormatString: string): number | undefined {
  return ms(timeFormatString)
}

/**
 * 時刻形式の文字列の内容から秒を求めて返却する
 *
 * ※形式に誤りがある場合はundefined
 *
 * @param timeFormatString '7d' といった形式の文字列
 * @see {@link https://github.com/vercel/ms}
 */
export function getSecondsFromTimeFormatString(timeFormatString: string): number | undefined {
  const msec = getMilliSecondsFromTimeFormatString(timeFormatString)
  if (msec === undefined) {
    return undefined
  }
  return Math.floor(msec / 1000)
}
