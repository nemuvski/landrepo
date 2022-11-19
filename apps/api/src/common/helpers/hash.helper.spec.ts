import {
  compareHashedValueWithBcrypt,
  compareHashedValueWithSHA512,
  hashValueWithBcrypt,
  hashValueWithSHA512,
} from '$/common/helpers/hash.helper'

describe('common/helpers/http-header.helper.ts', () => {
  test('compareHashedValueWithBcrypt()', async () => {
    // 72文字
    const plainValue = 'RlVfiZ1J7nFsHgTIuxXU0HVkyVchu75H3o7OEpNnFZrDS8JstKp8qgPHzgF1F3U3Qtw27KiI'
    const hashedValue = await hashValueWithBcrypt(plainValue)
    const result = await compareHashedValueWithBcrypt(plainValue, hashedValue)
    expect(result).toBe(true)
  })

  test('compareHashedValueWithSHA512()', () => {
    const plainValue =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R2YWx1ZSIsImlhdCI6MTUxNjIzOTAyMn0.bCwdrORrqumXNPxFBD_AnTG2pmb0Q73WCTMveltC9ho'
    const hashedValue = hashValueWithSHA512(plainValue)
    const result = compareHashedValueWithSHA512(plainValue, hashedValue)
    expect(result).toBe(true)
  })
})
