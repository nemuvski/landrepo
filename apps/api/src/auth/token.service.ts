import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { datetime } from '@project/datetime'
import type { JwtPayload } from '$/auth/types/jwt-payload.type'
import type { Tokens } from '$/auth/types/tokens.type'
import type { User } from '$/nestgraphql'
import type { FindUniqueRefreshTokenArgs } from '$/nestgraphql'
import type { DeleteOneRefreshTokenArgs } from '$/nestgraphql'
import { JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_TOKEN_EXPIRES_IN } from '$/auth/constants/jwt.constant'
import { hashValue } from '$/common/helpers/crypto.helper'
import { DatabaseService } from '$/database/database.service'

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private databaseService: DatabaseService
  ) {}

  /**
   * トークンの発行
   *
   * @param user Userエンティティ
   * @param sid 予め生成しておいたセッションID
   */
  getTokens(user: User, sid: string): Tokens {
    const iat = datetime().unix()
    const payload: JwtPayload = { sub: user.id, iat, role: user.role, sid }
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
    }
  }

  /**
   * RefreshTokenテーブルへレコードを追加
   *
   * @param user Userエンティティ
   * @param sid 予め生成しておいたセッションID
   * @param tokens トークン
   */
  async insertRefreshToken(user: User, sid: string, tokens: Tokens) {
    const { refreshToken } = tokens
    const hashedToken = await hashValue(refreshToken)
    await this.databaseService.refreshToken.create({ data: { id: sid, userId: user.id, token: hashedToken } })
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
   * RefreshTokenテーブルからレコードを一意に1件取得
   *
   * @param args
   */
  async fineUniqueRefreshToken(args: FindUniqueRefreshTokenArgs) {
    return this.databaseService.refreshToken.findUnique(args)
  }
}
