import { buildPath } from '@itsumono/utils'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PARAM_NAME_TOKEN, PATH_CHANGE_EMAIL, PATH_CHANGE_PASSWORD, PATH_SIGN_UP_CONFIRMATION } from '@project/auth'
import type { ChangeEmailTemplateContext } from '$/mail/types/change-email.type'
import type { ChangePasswordTemplateContext } from '$/mail/types/change-password.type'
import type { SignUpConfirmationTemplateContext } from '$/mail/types/sign-up-confirmation.type'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  private getSiteUrl(path: string) {
    return new URL(buildPath(this.configService.get<string>('NEST_SITE_BASE_URL'), path))
  }

  /**
   * 新規登録時の確認メールを送信する
   *
   * @param targetEmail
   * @param params メール本文中への埋め込みに利用する値等
   */
  async sendSignUpConfirmation(targetEmail: string, params: { token: string }) {
    const url = this.getSiteUrl(PATH_SIGN_UP_CONFIRMATION)
    url.searchParams.set(PARAM_NAME_TOKEN, params.token)
    const context: SignUpConfirmationTemplateContext = { url: url.toString() }
    await this.mailerService.sendMail({
      to: targetEmail,
      subject: '新規登録の確認の案内',
      template: './sign-up-confirmation',
      context,
    })
  }

  /**
   * メールアドレス変更の案内メールを送信する
   *
   * @param targetEmail
   * @param param
   */
  async sendChangeEmail(targetEmail: string, param: { token: string }) {
    const url = this.getSiteUrl(PATH_CHANGE_EMAIL)
    url.searchParams.set(PARAM_NAME_TOKEN, param.token)
    const context: ChangeEmailTemplateContext = { url: url.toString() }
    await this.mailerService.sendMail({
      to: targetEmail,
      subject: 'メールアドレス変更の案内',
      template: './change-email',
      context,
    })
  }

  /**
   * パスワード変更の案内メールを送信する
   *
   * @param targetEmail
   * @param param
   */
  async sendChangePassword(targetEmail: string, param: { token: string }) {
    const url = this.getSiteUrl(PATH_CHANGE_PASSWORD)
    url.searchParams.set(PARAM_NAME_TOKEN, param.token)
    const context: ChangePasswordTemplateContext = { url: url.toString() }
    await this.mailerService.sendMail({
      to: targetEmail,
      subject: 'パスワード変更の案内',
      template: './change-password',
      context,
    })
  }
}
