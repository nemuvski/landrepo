import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import type { User } from '$/nestgraphql'
import { TokenService } from '$/auth/token.service'
import { compareHashedValueWithBcrypt, hashValueWithBcrypt } from '$/common/helpers/hash.helper'
import { getTokenByAuthorizationHeader } from '$/common/helpers/http-header.helper'
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
      const isMatched = await compareHashedValueWithBcrypt(password, user.password)
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
    const hashedToken = await hashValueWithBcrypt(tokens.refreshToken)
    await this.tokenService.insertRefreshToken({
      data: { id: sessionId, User: { connect: { id: user.id } }, token: hashedToken },
    })
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
    // エラーなく削除できた場合はtrueを返却する
    return true
  }

  /**
   * トークンの再発行（リフレッシュトークン）
   *
   * @param user Userエンティティ
   * @param sessionId
   * @param authorizationValue 'Bearer XXX.YYY.ZZZ' といった形式の内容
   */
  async reissueTokens(user: User, sessionId: string, authorizationValue?: string): Promise<SignInUserResponse> {
    const targetRefreshToken = await this.tokenService.findRefreshToken({
      where: { id_userId: { userId: user.id, id: sessionId } },
    })
    if (!authorizationValue || !targetRefreshToken) {
      throw new UnauthorizedException()
    }

    const currentRefreshToken = getTokenByAuthorizationHeader(authorizationValue)
    // FIXME: なぜか毎回trueを返しているので修正すること
    const isMatched = await compareHashedValueWithBcrypt(currentRefreshToken, targetRefreshToken.token)
    if (!isMatched) {
      throw new UnauthorizedException()
    }

    const newTokens = this.tokenService.getTokens(user, sessionId)
    const hashedToken = await hashValueWithBcrypt(newTokens.refreshToken)
    await this.tokenService.updateRefreshToken({
      data: { token: { set: hashedToken } },
      where: { id_userId: { userId: user.id, id: sessionId } },
    })

    return {
      ...newTokens,
      user,
    }
  }
}
