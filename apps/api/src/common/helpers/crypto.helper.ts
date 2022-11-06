import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10 as const

export async function hashingPassword(plainTextPassword: string) {
  return await bcrypt.hash(plainTextPassword, SALT_ROUNDS)
}

export async function comparePassword(plainTextPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}
