import { getSecondsFromTimeFormatString, getMilliSecondsFromTimeFormatString } from '$/common/helpers/ms.helper'

describe('common/helpers/ms.helper.ts', () => {
  test('getMilliSecondsFromTimeFormatString()', () => {
    expect(getMilliSecondsFromTimeFormatString('5aa')).toBeUndefined()
    expect(getMilliSecondsFromTimeFormatString('5m')).toBe(300000)
    expect(getMilliSecondsFromTimeFormatString('7d')).toBe(604800000)
  })

  test('getSecondsFromTimeFormatString()', () => {
    expect(getSecondsFromTimeFormatString('5aa')).toBeUndefined()
    expect(getSecondsFromTimeFormatString('5m')).toBe(300)
    expect(getSecondsFromTimeFormatString('7d')).toBe(604800)
  })
})
