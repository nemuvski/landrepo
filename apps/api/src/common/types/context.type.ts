import type { JwtStrategyValidationReturnType, LocalStrategyValidateReturnType } from '$/auth/types/strategy.type'
import type { IncomingMessage } from 'node:http'

/**
 * NOTE: @UseGuards()のフローのメモ
 *
 * 1. `@UseGuards(LocalAuthGuard)`がLocalStrategyのvalidateを実行
 * 2. LocalStrategyのvalidateがAuthService.validateUser()を実行して、メールアドレスとパスワードをチェック
 * 3. 認証された(合致した)Userを`context`中の`user`フィールドに渡す
 */

type ContextBase = IncomingMessage

export interface WithLocalAuthGuardContext extends ContextBase {
  user: LocalStrategyValidateReturnType
}

export interface WithJwtAuthGuardContext {
  req: ContextBase & { user: JwtStrategyValidationReturnType }
}
