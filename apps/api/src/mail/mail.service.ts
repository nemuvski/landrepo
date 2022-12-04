import { buildPath } from '@itsumono/utils'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SignUpConfirmationTemplateContext } from '$/mail/types/sign-up-confirmation.type'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  /**
   * 新規登録時の確認メールを送信する
   *
   * @param targetEmail
   * @param params メール本文中への埋め込みに利用する値等
   */
  async sendSignUpConfirmation(targetEmail: string, params: { token: string }) {
    const url = new URL(buildPath(this.configService.get<string>('NEXT_SITE_BASE_URL'), '/_guide/sign-up-confirmation'))
    url.searchParams.set('tk', params.token)
    const context: SignUpConfirmationTemplateContext = { url: url.toString() }
    await this.mailerService.sendMail({
      to: targetEmail,
      subject: '新規登録の確認メール',
      template: './sign-up-confirmation',
      context,
    })
  }
}
