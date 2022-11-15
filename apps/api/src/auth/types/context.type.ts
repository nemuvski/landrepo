import type { LocalStrategyValidateReturnType } from '$/auth/types/strategy.type'

/**
 * NOTE: @UseGuards()のフローのメモ
 *
 * 1. `@UseGuards(LocalAuthGuard)`がLocalStrategyのvalidateを実行
 * 2. LocalStrategyのvalidateがAuthService.validateUser()を実行して、メールアドレスとパスワードをチェック
 * 3. 認証された(合致した)Userを`context`中の`user`フィールドに渡す
 */

export interface WithLocalAuthGuardContext {
  user: LocalStrategyValidateReturnType
}
