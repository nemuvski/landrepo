import { Injectable } from '@nestjs/common'
import { UserStatus } from '@project/database'
import type { CreateOneUserArgs, FindUniqueUserArgs } from '$/nestgraphql'
import type { UpdateOneUserArgs } from '$/nestgraphql'
import type { User } from '@project/database'
import { hashValueWithBcrypt } from '$/common/helpers/hash.helper'
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
   * Userテーブルからレコードを一意に1件取得
   *
   * @param args
   */
  async findUnique(args: FindUniqueUserArgs) {
    return this.databaseService.user.findUnique(args)
  }

  /**
   * Userテーブルへレコードを追加
   *
   * ※ passwordはハッシュ化した上で追加される。引数に渡す際は平文で良い。
   *
   * @param args
   */
  async create(args: CreateOneUserArgs) {
    args.data.password = await hashValueWithBcrypt(args.data.password)
    return this.databaseService.user.create(args)
  }

  /**
   * Userテーブルのレコードを更新
   * @param args
   */
  async update(args: UpdateOneUserArgs) {
    // パスワードの指定がある場合はハッシュ化する
    if (args.data.password && args.data.password.set) {
      args.data.password.set = await hashValueWithBcrypt(args.data.password.set)
    }
    return this.databaseService.user.update(args)
  }
}
