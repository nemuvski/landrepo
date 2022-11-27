import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { datetime, getSeconds } from '@project/datetime'
import { JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_TOKEN_EXPIRES_IN, type JwtPayload, type Tokens } from '@project/jwt'
import type {
  User,
  FindUniqueRefreshTokenArgs,
  DeleteOneRefreshTokenArgs,
  UpdateOneRefreshTokenArgs,
  CreateOneRefreshTokenArgs,
} from '$/nestgraphql'
import { generateUUIDv4 } from '$/common/helpers/uuid.helper'
import { DatabaseService } from '$/database/database.service'

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private databaseService: DatabaseService
  ) {}

  /**
   * トークンを発行し、トークンとリフレッシュトークンの失効時刻[sec]を返却する
   *
   * @param user Userエンティティ
   * @param sid 予め生成しておいたセッションID
   */
  getTokens(user: User, sid: string): Tokens {
    const jti = generateUUIDv4()
    const currentTimestamp = datetime()
    const payload: JwtPayload = { jti, sub: user.id, iat: currentTimestamp.unix(), role: user.role, sid }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('NEST_JWT_SECRET_KEY'),
      expiresIn: JWT_TOKEN_EXPIRES_IN,
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('NEST_JWT_REFRESH_SECRET_KEY'),
      expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    })

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: datetime
        .unix(currentTimestamp.unix() + (getSeconds(JWT_TOKEN_EXPIRES_IN) ?? 0))
        .toISOString(),
      refreshTokenExpiresIn: datetime
        .unix(currentTimestamp.unix() + (getSeconds(JWT_REFRESH_TOKEN_EXPIRES_IN) ?? 0))
        .toISOString(),
    }
  }

  /**
   * RefreshTokenテーブルへレコードを1件追加
   *
   * @param args
   */
  async createRefreshToken(args: CreateOneRefreshTokenArgs) {
    return this.databaseService.refreshToken.create(args)
  }

  /**
   * RefreshTokenテーブルからレコードを一意に1件削除
   *
   * @param args
   */
  async removeRefreshToken(args: DeleteOneRefreshTokenArgs) {
    return this.databaseService.refreshToken.delete(args)
  }

  /**
   * RefreshTokenテーブルのレコードを1件更新
   *
   * @param args
   */
  async updateRefreshToken(args: UpdateOneRefreshTokenArgs) {
    return this.databaseService.refreshToken.update(args)
  }

  /**
   * RefreshTokenテーブルからレコードを一意に1件取得
   *
   * @param args
   */
  async findUniqueRefreshToken(args: FindUniqueRefreshTokenArgs) {
    return this.databaseService.refreshToken.findUnique(args)
  }
}
