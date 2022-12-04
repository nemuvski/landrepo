import { Injectable } from '@nestjs/common'
import type { CreateOneUserArgs, FindUniqueUserArgs } from '$/nestgraphql'
import type { UpdateOneUserArgs } from '$/nestgraphql'
import { hashValueWithBcrypt } from '$/common/helpers/hash.helper'
import { DatabaseService } from '$/database/database.service'

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

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
