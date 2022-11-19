import { getTokenByAuthorizationHeader } from '$/common/helpers/http-header.helper'

describe('common/helpers/http-header.helper.ts', () => {
  test('getTokenByAuthorizationHeader()', () => {
    const sampleJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R2YWx1ZSIsImlhdCI6MTUxNjIzOTAyMn0.bCwdrORrqumXNPxFBD_AnTG2pmb0Q73WCTMveltC9ho'
    expect(getTokenByAuthorizationHeader('Bearer ' + sampleJWT)).toBe(sampleJWT)
    expect(getTokenByAuthorizationHeader('  Bearer  ' + sampleJWT + '  ')).toBe(sampleJWT)
    expect(getTokenByAuthorizationHeader(sampleJWT)).toBe(sampleJWT)
  })
})
