import type { User } from '$/nestgraphql'
import type { JwtPayload, JwtPayloadBase } from '@project/auth'

/**
 * `LocalStrategy.validate()`を実行した結果の型
 */
export type LocalStrategyValidateReturnType = User

/**
 * `JwtStrategy.validate()` または `JwtRefreshStrategy.validate()` を実行した結果の型
 *
 * NOTE: エンティティと分かるように便宜的に末尾にEntityとつけている
 */
export type JwtStrategyValidationReturnType<P extends JwtPayloadBase = JwtPayload> = P & { user: User }
