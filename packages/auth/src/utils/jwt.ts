import jwtDecode from 'jwt-decode'
import type { JwtPayloadBase } from '../types'

/**
 * JWTのPayload部分をデコードして返却する
 *
 * ※ デコード失敗時はnull
 *
 * @param jwt
 */
export function getJwtPayload<T extends JwtPayloadBase>(jwt: string) {
  try {
    // NOTE: 利用箇所でプロパティチェックをさせるために、あえてPartialを指定している
    return jwtDecode<Partial<T>>(jwt, { header: false })
  } catch (error) {
    return null
  }
}
