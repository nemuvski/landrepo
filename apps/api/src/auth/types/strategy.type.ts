import type { JwtOneTimePayload, JwtPayload, JwtPayloadBase } from '@project/auth'
import type { User, RefreshToken } from '@project/database'

/**
 * `LocalStrategy.validate()`の返却値の型
 */
export type LocalStrategyValidateReturnType = User

/**
 * `JwtStrategy.validate()` または `JwtRefreshStrategy.validate()` の返却値の型
 */
export type JwtStrategyValidateReturnType<P extends JwtPayloadBase = JwtPayload> = P & {
  user: User
  refreshToken: RefreshToken
}

/**
 * `JwtOneTimeStrategy.validate()` の返却値の型
 */
export type JwtOneTimeStrategyValidateReturnType = JwtOneTimePayload & { user: User }
