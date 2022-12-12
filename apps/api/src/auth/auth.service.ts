import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthErrorMessage } from '@project/api-error'
import { JwtOneTimePayloadUseField } from '@project/auth'
import { UserRole, UserStatus, type User, type RefreshToken } from '@project/database'
import { datetime } from '@project/datetime'
import type { SignInUserResponse } from '$/auth/dto/sign-in-user.response'
import type { VerifySessionResponse } from '$/auth/dto/verify-session.response'
import { TokenService } from '$/auth/token.service'
import { isRestrictedSendingConfirmationEmail } from '$/common/helpers/confirmation-email.helper'
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
    const user = await this.usersService.findFirst({ where: { email, status: UserStatus.CONFIRMED } })
    if (user) {
      const isMatched = await compareHashedValueWithBcrypt(password, user.password)
      if (isMatched) {
        return user
      }
    }
    // ログイン可能なユーザーが存在しない、またはパスワードが合わない場合はnullを返却
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
    if (!this.usersService.isValidPasswordFormat(password)) {
      throw new BadRequestException(AuthErrorMessage.InvalidPasswordFormat)
    }

    const user = await this.usersService.findUnique({ where: { email } })
    if (user) {
      if (this.usersService.isCanceledUser(user)) {
        throw new ForbiddenException(AuthErrorMessage.EmailAddressCurrentlyUnavailable)
      }
      // NOTE: NotConfirmedステータスの場合は再度確認メールを送信できるようにしたいため除外しない
      if (!this.usersService.isNotConfirmedUser(user)) {
        throw new ForbiddenException(AuthErrorMessage.UserAlreadyExists)
      }
    }

    let oneTimeToken: string
    if (user) {
      if (user.signUpConfirmationSentAt && isRestrictedSendingConfirmationEmail(user.signUpConfirmationSentAt)) {
        throw new ForbiddenException(AuthErrorMessage.RestrictedSendingConfirmationEmail)
      }

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
        data: { email, password, role, status: UserStatus.NOT_CONFIRMED },
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
   * @param refreshToken RefreshTokenエンティティ
   * @param authorizationValue 'Bearer XXX.YYY.ZZZ' といった形式の内容
   */
  async reissueTokens(user: User, refreshToken: RefreshToken, authorizationValue: string): Promise<SignInUserResponse> {
    const currentRefreshToken = getTokenByAuthorizationHeader(authorizationValue)
    const isMatched = compareHashedValueWithSHA256(currentRefreshToken, refreshToken.token)
    if (!isMatched) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidSession)
    }
    const newTokens = this.tokenService.getTokens(user, refreshToken.id)
    await this.tokenService.updateRefreshToken({
      data: { token: { set: newTokens.refreshToken }, expiresIn: { set: newTokens.refreshTokenExpiresIn } },
      where: { id_userId: { userId: user.id, id: refreshToken.id } },
    })
    return {
      ...newTokens,
      user,
    }
  }

  /**
   * 新規登録時の確認メール中のトークンを検証し、あっていればユーザーのステータスを確認済みに更新する
   *
   * @param user
   * @param authorizationValue
   */
  async verifyTokenAtSignUp(user: User, authorizationValue?: string): Promise<boolean> {
    if (!authorizationValue || !user.signUpConfirmationToken) {
      throw new UnauthorizedException(AuthErrorMessage.UserNonTargetSignUp)
    }
    const token = getTokenByAuthorizationHeader(authorizationValue)
    const isMatched = compareHashedValueWithSHA256(token, user.signUpConfirmationToken)
    if (!isMatched) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidOneTimeToken)
    }

    await this.usersService.update({
      where: { id: user.id },
      data: {
        status: { set: UserStatus.CONFIRMED },
        signUpConfirmationToken: { set: null },
        signUpConfirmedAt: { set: datetime().toISOString() },
      },
    })

    return true
  }

  /**
   * メールアドレス変更の確認メールを送信する
   *
   * @param user
   * @param newEmail
   */
  async claimChangingOwnEmail(user: User, newEmail: string) {
    // 新しいメールアドレスが既にユーザーに利用されている場合はNG
    const newEmailUsingUser = await this.usersService.findUnique({ where: { email: newEmail } })
    if (newEmailUsingUser) {
      throw new BadRequestException(AuthErrorMessage.UserAlreadyExists)
    }

    if (user.changeEmailSentAt && isRestrictedSendingConfirmationEmail(user.changeEmailSentAt)) {
      throw new ForbiddenException(AuthErrorMessage.RestrictedSendingConfirmationEmail)
    }

    const oneTimeToken = this.tokenService.getOneTimeToken(user, JwtOneTimePayloadUseField.ChangeEmail)
    await this.usersService.update({
      data: {
        changeEmail: { set: newEmail },
        changeEmailCompletedAt: { set: null },
        changeEmailToken: { set: oneTimeToken },
        changeEmailSentAt: { set: datetime().toISOString() },
      },
      where: { id: user.id },
    })
    await this.mailService.sendChangeEmail(newEmail, { token: oneTimeToken })
    return true
  }

  /**
   * パスワード変更時の確認メール中のトークンを検証し、あっていれば新しいメールアドレスを設定する
   *
   * @param user
   * @param authorizationValue
   */
  async verifyTokenAtChangeEmail(user: User, authorizationValue: string): Promise<boolean> {
    const token = getTokenByAuthorizationHeader(authorizationValue)
    const isMatched = compareHashedValueWithSHA256(token, user.changeEmailToken)
    if (!isMatched) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidOneTimeToken)
    }
    await this.usersService.update({
      data: {
        // NOTE: Guardで事前にあることはチェック済みなので、typeエラー回避
        email: { set: user.changeEmail ?? '' },
        changeEmail: { set: null },
        changeEmailCompletedAt: { set: datetime().toISOString() },
        changeEmailToken: { set: null },
        changeEmailSentAt: { set: null },
      },
      where: { id: user.id },
    })
    return true
  }

  /**
   * パスワード変更の確認メールを送信する
   *
   * @param email
   */
  async claimChangingPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findUnique({ where: { email } })
    if (!user) {
      throw new BadRequestException(AuthErrorMessage.UserNotFound)
    }
    if (user.changePasswordSentAt && isRestrictedSendingConfirmationEmail(user.changePasswordSentAt)) {
      throw new ForbiddenException(AuthErrorMessage.RestrictedSendingConfirmationEmail)
    }

    const oneTimeToken = this.tokenService.getOneTimeToken(user, JwtOneTimePayloadUseField.ChangePassword)
    await this.usersService.update({
      data: {
        changePasswordCompletedAt: { set: null },
        changePasswordToken: { set: oneTimeToken },
        changePasswordSentAt: { set: datetime().toISOString() },
      },
      where: { id: user.id },
    })
    await this.mailService.sendChangePassword(email, { token: oneTimeToken })
    return true
  }

  /**
   * パスワード変更時の確認メール中のトークンを検証
   *
   * @param user
   * @param authorizationValue
   */
  async verifyTokenAtChangePassword(user: User, authorizationValue: string): Promise<boolean> {
    const token = getTokenByAuthorizationHeader(authorizationValue)
    const isMatched = compareHashedValueWithSHA256(token, user.changePasswordToken)
    if (!isMatched) {
      throw new UnauthorizedException(AuthErrorMessage.InvalidOneTimeToken)
    }
    return true
  }

  /**
   * ユーザーのメールアドレスを変更する
   *
   * @param user
   * @param newPassword
   * @see {verifyTokenAtChangePassword()} resolverにて事前チェックしている
   */
  async changePassword(user: User, newPassword: string): Promise<boolean> {
    if (!this.usersService.isValidPasswordFormat(newPassword)) {
      throw new BadRequestException(AuthErrorMessage.InvalidPasswordFormat)
    }

    await this.usersService.update({
      data: {
        password: newPassword,
        changePasswordCompletedAt: { set: datetime().toISOString() },
        changePasswordToken: { set: null },
        changePasswordSentAt: { set: null },
      },
      where: { id: user.id },
    })
    return true
  }
}
