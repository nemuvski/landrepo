import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserRole } from '@project/database'
import { datetime } from '@project/datetime'
import { JwtOneTimePayloadUseField } from '@project/jwt'
import type { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import type { VerifySessionResponse } from '$/auth/dto/verify-session.response'
import type { User } from '$/nestgraphql'
import { TokenService } from '$/auth/token.service'
import { compareHashedValueWithBcrypt, compareHashedValueWithSHA256 } from '$/common/helpers/hash.helper'
import { getTokenByAuthorizationHeader } from '$/common/helpers/http-header.helper'
import { generateUUIDv4 } from '$/common/helpers/uuid.helper'
import { MailService } from '$/mail/mail.service'
import { UsersService } from '$/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private mailService: MailService
  ) {}

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
   * ユーザー新規登録
   *
   * @param email
   * @param password
   * @param role
   */
  async signUp(email: string, password: string, role: UserRole = UserRole.GENERAL): Promise<boolean> {
    const user = await this.usersService.findUnique({ where: { email } })
    // ユーザーレコードがあり、確認済みの場合は処理しない
    if (user && user.signUpConfirmedAt) {
      throw new ForbiddenException()
    }

    let oneTimeToken: string
    if (user) {
      oneTimeToken = this.tokenService.getOneTimeToken(user, JwtOneTimePayloadUseField.SignUp)
      await this.usersService.update({
        data: {
          password: { set: password },
          role: { set: role },
          signUpConfirmationToken: { set: oneTimeToken },
          signUpConfirmationSentAt: { set: datetime().toISOString() },
        },
        where: { id: user.id },
      })
    } else {
      const newUser = await this.usersService.create({
        data: {
          email,
          password,
          role,
        },
      })
      oneTimeToken = this.tokenService.getOneTimeToken(newUser, JwtOneTimePayloadUseField.SignUp)
      await this.usersService.update({
        data: {
          signUpConfirmationToken: { set: oneTimeToken },
          signUpConfirmationSentAt: { set: datetime().toISOString() },
        },
        where: { id: newUser.id },
      })
    }

    await this.mailService.sendSignUpConfirmation(email, { token: oneTimeToken })
    return true
  }

  /**
   * トークンを発行
   *
   * @param user Userエンティティ
   */
  async signIn(user: User): Promise<SignInUserResponse> {
    const sessionId = generateUUIDv4()
    const tokens = this.tokenService.getTokens(user, sessionId)
    await this.tokenService.createRefreshToken({
      data: {
        id: sessionId,
        User: { connect: { id: user.id } },
        token: tokens.refreshToken,
        expiresIn: tokens.refreshTokenExpiresIn,
      },
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
   * アクセストークンの検証して、問題ない際に返却する
   *
   * @param user
   * @param expiresInUnix 失効する時刻 (UNIXタイム)
   */
  async verifySession(user: User, expiresInUnix: number): Promise<VerifySessionResponse> {
    return {
      accessTokenExpiresIn: datetime.unix(expiresInUnix).toISOString(),
      user,
    }
  }

  /**
   * トークンの再発行（リフレッシュトークン）
   *
   * @param user Userエンティティ
   * @param sessionId
   * @param authorizationValue 'Bearer XXX.YYY.ZZZ' といった形式の内容
   */
  async reissueTokens(user: User, sessionId: string, authorizationValue?: string): Promise<SignInUserResponse> {
    // NOTE: expiresInカラムの内容も条件(where)に含めた方が良いが、事前にUseGuardsで弾かれるため省略している
    const targetRefreshToken = await this.tokenService.findUniqueRefreshToken({
      where: { id_userId: { userId: user.id, id: sessionId } },
    })
    if (!authorizationValue || !targetRefreshToken) {
      throw new UnauthorizedException()
    }

    const currentRefreshToken = getTokenByAuthorizationHeader(authorizationValue)
    const isMatched = compareHashedValueWithSHA256(currentRefreshToken, targetRefreshToken.token)
    if (!isMatched) {
      throw new UnauthorizedException()
    }

    const newTokens = this.tokenService.getTokens(user, sessionId)
    await this.tokenService.updateRefreshToken({
      data: { token: { set: newTokens.refreshToken }, expiresIn: { set: newTokens.refreshTokenExpiresIn } },
      where: { id_userId: { userId: user.id, id: sessionId } },
    })

    return {
      ...newTokens,
      user,
    }
  }
}
