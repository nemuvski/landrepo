import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10 as const

export async function hashValue(plainValue: string) {
  return await bcrypt.hash(plainValue, SALT_ROUNDS)
}

export async function compareHashedValue(plainValue: string, hashedValue: string) {
  return await bcrypt.compare(plainValue, hashedValue)
}
