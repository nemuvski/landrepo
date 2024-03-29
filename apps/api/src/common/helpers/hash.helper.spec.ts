import {
  compareHashedValueWithBcrypt,
  compareHashedValueWithSHA256,
  hashValueWithBcrypt,
  hashValueWithSHA256,
} from '$/common/helpers/hash.helper'

describe('common/helpers/hash.helper.ts', () => {
  test('compareHashedValueWithBcrypt()', async () => {
    // 72文字
    const plainValue = 'RlVfiZ1J7nFsHgTIuxXU0HVkyVchu75H3o7OEpNnFZrDS8JstKp8qgPHzgF1F3U3Qtw27KiI'
    const hashedValue = await hashValueWithBcrypt(plainValue)
    const result = await compareHashedValueWithBcrypt(plainValue, hashedValue)
    expect(result).toBe(true)
  })

  test('compareHashedValueWithSHA256()', () => {
    const plainValue =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R2YWx1ZSIsImlhdCI6MTUxNjIzOTAyMn0.bCwdrORrqumXNPxFBD_AnTG2pmb0Q73WCTMveltC9ho'
    const hashedValue = hashValueWithSHA256(plainValue)
    const result = compareHashedValueWithSHA256(plainValue, hashedValue)
    expect(result).toBe(true)
  })
})
