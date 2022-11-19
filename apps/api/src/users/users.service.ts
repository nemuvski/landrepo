import { Injectable } from '@nestjs/common'
import type { CreateOneUserArgs, FindUniqueUserArgs } from '$/nestgraphql'
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
}
