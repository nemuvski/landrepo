import { Injectable } from '@nestjs/common'
import { MAX_LENGTH_PASSWORD } from '@project/auth'
import { UserStatus } from '@project/database'
import type Prisma from '$/prisma'
import type { User } from '@project/database'
import { hashValueWithBcrypt, hashValueWithSHA256 } from '$/common/helpers/hash.helper'
import {
  normalizedNullableStringFieldUpdateOperationsInput,
  normalizedStringFieldUpdateOperationsInput,
} from '$/common/helpers/prisma.helper'
import { DatabaseService } from '$/database/database.service'

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * メールが未確認状態のユーザーである場合はTrueを返却
   *
   * @param user
   */
  isNotConfirmedUser(user: User) {
    return user.status === UserStatus.NOT_CONFIRMED
  }

  /**
   * ログイン可能なユーザーである場合はTrueを返却
   *
   * @param user
   */
  isActiveUser(user: User) {
    return user.status === UserStatus.ACTIVE
  }

  /**
   * 新規登録フローの対象となるユーザーである場合はTrueを返却
   *
   * ※ トークンチェックはここではしない
   *
   * @param user
   */
  isTargetSignUpConfirmation(user: User) {
    return this.isNotConfirmedUser(user) && user.signUpConfirmationToken
  }

  /**
   * メールアドレス変更フローの対象となるユーザーである場合はTrueを返却
   *
   * ※ トークンチェックはここではしない
   *
   * @param user
   */
  isTargetChangingEmailConfirmation(user: User) {
    return this.isActiveUser(user) && user.changeEmailToken && user.changeEmail
  }

  /**
   * パスワード変更フローの対象となるユーザーである場合はTrueを返却
   *
   * ※ トークンチェックはここではしない
   *
   * @param user
   */
  isTargetChangingPasswordConfirmation(user: User) {
    return this.isActiveUser(user) && user.changePasswordToken
  }

  /**
   * パスワードの有効条件を満たしている場合はTrueを返却
   *
   * ※ 新規登録時、パスワード変更時に利用
   *
   * @param plainTextPassword
   */
  isValidPasswordFormat(plainTextPassword: string) {
    return 0 < plainTextPassword.length && plainTextPassword.length <= MAX_LENGTH_PASSWORD
  }

  /**
   * Userテーブルからレコードを一意に1件取得
   *
   * @param args
   */
  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return this.databaseService.user.findUnique(args)
  }

  /**
   * Userテーブルへレコードを追加
   *
   * ※ passwordはハッシュ化した上で追加される。引数に渡す際は平文で良い。
   *
   * @param args
   */
  async create(args: Prisma.UserCreateArgs) {
    if (args.data.password) {
      args.data.password = await hashValueWithBcrypt(args.data.password)
    }
    if (args.data.signUpConfirmationToken) {
      args.data.signUpConfirmationToken = hashValueWithSHA256(args.data.signUpConfirmationToken)
    }
    if (args.data.changeEmailToken) {
      args.data.changeEmailToken = hashValueWithSHA256(args.data.changeEmailToken)
    }
    if (args.data.changePasswordToken) {
      args.data.changePasswordToken = hashValueWithSHA256(args.data.changePasswordToken)
    }
    return this.databaseService.user.create(args)
  }

  /**
   * Userテーブルのレコードを更新
   *
   * @param args
   */
  async update(args: Prisma.UserUpdateArgs) {
    if (args.data.password) {
      args.data.password = normalizedStringFieldUpdateOperationsInput(args.data.password)
      if (args.data.password.set) {
        args.data.password.set = await hashValueWithBcrypt(args.data.password.set)
      }
    }
    if (args.data.signUpConfirmationToken) {
      args.data.signUpConfirmationToken = normalizedNullableStringFieldUpdateOperationsInput(
        args.data.signUpConfirmationToken
      )
      if (args.data.signUpConfirmationToken.set) {
        args.data.signUpConfirmationToken.set = hashValueWithSHA256(args.data.signUpConfirmationToken.set)
      }
    }
    if (args.data.changeEmailToken) {
      args.data.changeEmailToken = normalizedNullableStringFieldUpdateOperationsInput(args.data.changeEmailToken)
      if (args.data.changeEmailToken.set) {
        args.data.changeEmailToken.set = hashValueWithSHA256(args.data.changeEmailToken.set)
      }
    }
    if (args.data.changePasswordToken) {
      args.data.changePasswordToken = normalizedNullableStringFieldUpdateOperationsInput(args.data.changePasswordToken)
      if (args.data.changePasswordToken.set) {
        args.data.changePasswordToken.set = hashValueWithSHA256(args.data.changePasswordToken.set)
      }
    }
    return this.databaseService.user.update(args)
  }
}
