import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import type { User } from '@project/database'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'ユーザー確認メール',
      template: './sample',
      context: {
        name: user.id,
      },
    })
  }
}
