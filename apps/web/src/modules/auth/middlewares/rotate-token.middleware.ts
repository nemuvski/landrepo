import { datetime } from '@project/datetime'
import { NextResponse } from 'next/server'
import { gql } from 'urql'
import { COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '~/modules/auth/constants'
import { mustReissueToken } from '~/modules/auth/utils'
import { defaultCookieOptions } from '~/modules/cookie'
import { graphqlClient } from '~/modules/graphql'
import type { Tokens } from '@project/auth'
import type { NextRequest, NextMiddleware } from 'next/server'

async function verifySession(accessToken: string) {
  const { data, error } = await graphqlClient({ token: accessToken })
    .mutation<{
      verifySession: Pick<Tokens, 'accessTokenExpiresIn'>
    }>(
      gql`
        mutation {
          verifySession {
            accessTokenExpiresIn
          }
        }
      `,
      {}
    )
    .toPromise()
  if (!data || error) {
    throw new Error('アクセストークンが無効です')
  }
  return data.verifySession.accessTokenExpiresIn
}

async function reissueTokens(refreshToken: string) {
  const { data, error } = await graphqlClient({ token: refreshToken })
    .mutation<{ reissueTokens: Tokens }>(
      gql`
        mutation {
          reissueTokens {
            accessToken
            refreshToken
            accessTokenExpiresIn
            refreshTokenExpiresIn
          }
        }
      `,
      {}
    )
    .toPromise()
  if (!data || error) {
    throw new Error('トークン再発行に失敗しました')
  }
  return data.reissueTokens
}

/**
 * アクセストークンのローテーション
 *
 * ※ トークン再発行された場合のみ
 */
async function rotateTokenHandler(req: NextRequest): Promise<Tokens | null> {
  /**
   * NOTE: nookies.parseCookies()がNextRequestに対応していないので、ここでは利用しない
   * @see {https://nextjs.org/docs/advanced-features/middleware#using-cookies}
   */
  const accessToken = req.cookies.get(COOKIE_NAME_ACCESS_TOKEN)?.value
  const refreshToken = req.cookies.get(COOKIE_NAME_REFRESH_TOKEN)?.value

  /**
   * ローテーションといった処理はしない
   *
   * アクセストークン: なし
   * リフレッシュトークン: なし
   */
  if (!accessToken && !refreshToken) {
    return null
  }

  /**
   * アクセストークンのチェック
   *
   * アクセストークン: あり
   * リフレッシュトークン: あり
   */
  if (accessToken && refreshToken) {
    const expiresIn = await verifySession(accessToken)
    // アクセストークンの期限が近づいている場合は再発行
    if (mustReissueToken(expiresIn)) {
      return reissueTokens(refreshToken)
    }
    return null
  }

  /**
   * アクセストークンの再発行
   *
   * アクセストークン: なし
   * リフレッシュトークン: あり
   */
  if (!accessToken && refreshToken) {
    return reissueTokens(refreshToken)
  }

  /**
   * イレギュラー
   *
   * アクセストークン: あり
   * リフレッシュトークン: なし
   */
  if (accessToken && !refreshToken) {
    throw new Error('アクセストークンのみがクッキーに設定されているケースはイレギュラーです')
  }

  // フォールバック
  return null
}

export const middleware: NextMiddleware = async (req, _event) => {
  const res = NextResponse.next()

  try {
    const tokens = await rotateTokenHandler(req)
    // NOTE: tokensがnullでない場合はヘッダーにクッキーを設定する
    if (tokens) {
      res.cookies.set({
        ...defaultCookieOptions,
        name: COOKIE_NAME_ACCESS_TOKEN,
        value: tokens.accessToken,
        expires: datetime(tokens.accessTokenExpiresIn).toDate(),
      })
      res.cookies.set({
        ...defaultCookieOptions,
        name: COOKIE_NAME_REFRESH_TOKEN,
        value: tokens.refreshToken,
        expires: datetime(tokens.refreshTokenExpiresIn).toDate(),
      })
    }
  } catch (error) {
    console.error(error)
    // エラー時はクッキーを削除
    res.cookies.delete(COOKIE_NAME_ACCESS_TOKEN)
    res.cookies.delete(COOKIE_NAME_REFRESH_TOKEN)
  }

  return res
}
