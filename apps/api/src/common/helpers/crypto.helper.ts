import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10 as const

export async function hashValue(plainValue: string) {
  return bcrypt.hash(plainValue, SALT_ROUNDS)
}

export async function compareHashedValue(plainValue: string, hashedValue: string) {
  return bcrypt.compare(plainValue, hashedValue)
}
