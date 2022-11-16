import { Injectable } from '@nestjs/common'
import type { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import type { User } from '$/nestgraphql'
import { TokenService } from '$/auth/token.service'
import { compareHashedValue } from '$/common/helpers/crypto.helper'
import { generateUUIDv4 } from '$/common/helpers/uuid.helper'
import { UsersService } from '$/users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private tokenService: TokenService) {}

  /**
   * Userの有無とパスワードの比較し、一致すればUserエンティティを返却
   *
   * @param email メールアドレス
   * @param password 平文のパスワード
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUnique({ where: { email } })
    if (user) {
      const isMatched = await compareHashedValue(password, user.password)
      if (isMatched) {
        return user
      }
    }
    // ユーザーが存在しない、またはパスワードが合わない場合はnullを返却
    return null
  }

  /**
   * トークンを発行
   *
   * @param user Userエンティティ
   */
  async signIn(user: User): Promise<SignInUserResponse> {
    const sessionId = generateUUIDv4()
    const tokens = this.tokenService.getTokens(user, sessionId)
    await this.tokenService.insertRefreshToken(user, sessionId, tokens)
    return {
      ...tokens,
      user,
    }
  }

  /**
   * RefreshTokenテーブルに登録してある対象（現セッション）のトークンのレコードを削除
   *
   * @param userId
   * @param sessionId
   */
  async signOut(userId: string, sessionId: string): Promise<boolean> {
    await this.tokenService.removeRefreshToken({ where: { id_userId: { userId, id: sessionId } } })
    // エラーなく削除できた場合はtrueを返却するs
    return true
  }

  /**
   * トークンリフレッシュ
   *
   * @param userId
   * @param sessionId
   * @param authorizationValue 'Bearer XXX.YYY.ZZZ' といった形式の内容
   */
  async updateRefreshToken(userId: string, sessionId: string, authorizationValue: string): Promise<void> {
    // TODO: 更新する
  }
}
