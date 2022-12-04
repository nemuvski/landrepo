import { createHash } from 'node:crypto'
import * as bcrypt from 'bcrypt'

/**
 * @see {@link https://nodejs.org/api/crypto.html#cryptogethashes}
 */
const CRYPTO_HASH_ALGORITHM_SHA256 = 'sha256' as const

const BCRYPT_SALT_ROUNDS = 10 as const

/**
 * 引数plainValueをbcryptでハッシュ化した値を返却する
 *
 * @param plainValue 平文テキスト
 * @see {@link https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns} 72バイトの制限に注意
 */
export async function hashValueWithBcrypt(plainValue: string) {
  return bcrypt.hash(plainValue, BCRYPT_SALT_ROUNDS)
}

/**
 * 引数plainValueと引数hashedValue(bcryptでハッシュ化した値)を比較し、一致する場合はTrueを返却する
 *
 * @param plainValue 平文テキスト
 * @param hashedValue ハッシュ値 (bcryptでハッシュ化した値)
 * @see {@link https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns} 72バイトの制限に注意
 * @see {hashValueWithBcrypt()}
 */
export async function compareHashedValueWithBcrypt(plainValue: string, hashedValue: string) {
  return bcrypt.compare(plainValue, hashedValue)
}

/**
 * 引数plainValueをSHA256でハッシュ化した値を返却する
 *
 * @param plainValue 平文テキスト
 * @see {@link https://nodejs.org/api/crypto.html}
 */
export function hashValueWithSHA256(plainValue: string) {
  const hashAlg = createHash(CRYPTO_HASH_ALGORITHM_SHA256)
  return hashAlg.update(plainValue).digest('hex')
}

/**
 * 引数plainValueと引数hashedValue(SHA256でハッシュ化した値)を比較し、一致する場合はTrueを返却する
 *
 * @param plainValue
 * @param hashedValue
 * @see {@link https://nodejs.org/api/crypto.html}
 * @see {hashValueWithSHA256()}
 */
export function compareHashedValueWithSHA256(plainValue: string, hashedValue: string) {
  const v = hashValueWithSHA256(plainValue)
  return v === hashedValue
}
