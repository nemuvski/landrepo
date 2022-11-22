import type { User } from '$/nestgraphql'
import type { JwtPayload } from '@project/jwt'

/**
 * `LocalStrategy.validate()`を実行した結果の型
 */
export type LocalStrategyValidateReturnType = User

/**
 * `JwtStrategy.validate()` または `JwtRefreshStrategy.validate()` を実行した結果の型
 *
 * NOTE: エンティティと分かるように便宜的に末尾にEntityとつけている
 */
export type JwtStrategyValidationReturnType = User & Pick<JwtPayload, 'sid'>
