import type { User } from '@project/database'

/**
 * Userエンティティ
 *
 * ※フロントエンドで利用するフィールドのみ
 */
export type UserEntity = Pick<User, 'id' | 'email' | 'role'>
