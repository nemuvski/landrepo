import type { User, RefreshToken } from '$/nestgraphql'

/**
 * `LocalStrategy.validate()`を実行した結果の型
 */
export type LocalStrategyValidateReturnType = User

/**
 * `JwtStrategy.validate()` を実行した結果の型
 *
 * NOTE: エンティティと分かるように便宜的に末尾にEntityとつけている
 */
export type JwtStrategyValidationReturnType = {
  userEntity: User
  refreshTokenEntity: RefreshToken
}

/**
 * `JwtRefreshStrategy.validate()` を実行した結果の型
 */
export type JwtRefreshStrategyValidationReturnType = JwtStrategyValidationReturnType
