import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { datetime } from '@project/datetime'
import type { JwtPayload } from '$/auth/types/jwt-payload.type'
import type { Tokens } from '$/auth/types/tokens.type'
import type { User } from '$/nestgraphql'
import type { FindUniqueRefreshTokenArgs } from '$/nestgraphql'
import type { DeleteOneRefreshTokenArgs } from '$/nestgraphql'
import type { UpdateOneRefreshTokenArgs } from '$/nestgraphql'
import type { CreateOneRefreshTokenArgs } from '$/nestgraphql'
import { JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_TOKEN_EXPIRES_IN } from '$/auth/constants/jwt.constant'
import { getSecondsFromTimeFormatString } from '$/common/helpers/ms.helper'
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
  getTokens(user: User, sid: string): [Tokens, number] {
    const jti = generateUUIDv4()
    const currentTimestamp = datetime().unix()
    const payload: JwtPayload = { jti, sub: user.id, iat: currentTimestamp, role: user.role, sid }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('NEST_JWT_SECRET_KEY'),
      expiresIn: JWT_TOKEN_EXPIRES_IN,
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('NEST_JWT_REFRESH_SECRET_KEY'),
      expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    })

    const refreshTokenExpirationTimeSec =
      currentTimestamp + (getSecondsFromTimeFormatString(JWT_REFRESH_TOKEN_EXPIRES_IN) ?? 0)

    return [
      {
        accessToken,
        refreshToken,
      },
      refreshTokenExpirationTimeSec,
    ]
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
  async findRefreshToken(args: FindUniqueRefreshTokenArgs) {
    return this.databaseService.refreshToken.findUnique(args)
  }
}
