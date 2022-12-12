import { trimGqlPrefixErrorMessage } from '@project/api-error'
import { destroyCookie, parseCookies } from 'nookies'
import { useEffect, useRef, useState } from 'react'
import { gql } from 'urql'
import ApiRouteError, { isApiRouteError } from '~/exceptions/api-route.error'
import { useSessionUpdater } from '~/modules/auth'
import { COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '~/modules/auth/constants'
import { defaultCookieOptions } from '~/modules/cookie'
import { graphqlClient } from '~/modules/graphql'
import { AxiosError, axiosNextApiRoute } from '~/modules/http-client'
import { getRateLimitToken, rateLimit } from '~/modules/rate-limit'
import type { NextApiRequest, NextApiResponse } from 'next'

export type CancelServiceMutationInput = { password: string }

/**
 * サービス退会のハンドラを提供する
 */
export function useCancelServiceHandler(): [
  (input: CancelServiceMutationInput) => Promise<void>,
  { loading: boolean }
] {
  const updater = useSessionUpdater()
  const abortController = useRef<AbortController | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    abortController.current = new AbortController()
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  const handler = async (input: CancelServiceMutationInput) => {
    setLoading(true)
    try {
      await axiosNextApiRoute.post('/auth/cancel-service', { ...input }, { signal: abortController.current?.signal })
      updater(null)
    } catch (error) {
      console.error(error)
      // NOTE: abortされると、error.responseがないためケアしておく
      if (error instanceof AxiosError && error.response) {
        // @ts-ignore: statusはエラーコードが入る
        throw new ApiRouteError(error.response.status, error.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return [handler, { loading }]
}

/**
 * 基本的には1回実行できれば良いので、制限を1回とした
 */
const RATE_LIMIT = 3

/**
 * @see /api/auth/cancel-service
 */
export async function cancelServiceApiRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    rateLimit.check(res, getRateLimitToken(req), RATE_LIMIT)

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      throw new ApiRouteError(405)
    }

    // リフレッシュトークンがあれば良い
    const cookies = parseCookies({ req })
    const refreshToken = cookies[COOKIE_NAME_REFRESH_TOKEN]
    if (!refreshToken) {
      throw new ApiRouteError(403)
    }

    const { password } = req.body as Partial<CancelServiceMutationInput>
    if (!password) {
      throw new ApiRouteError(400)
    }

    const { error } = await graphqlClient({ token: refreshToken })
      .mutation<{ cancelService: boolean }, CancelServiceMutationInput>(
        gql`
          mutation ($password: String!) {
            cancelService(input: { password: $password })
          }
        `,
        { password }
      )
      .toPromise()

    if (error) {
      throw new ApiRouteError(401, trimGqlPrefixErrorMessage(error))
    }

    // アクセストークン関連のクッキーを破棄
    // NOTE: 削除する際はオプションにpathを設定しておくこと
    destroyCookie({ res }, COOKIE_NAME_ACCESS_TOKEN, defaultCookieOptions)
    destroyCookie({ res }, COOKIE_NAME_REFRESH_TOKEN, defaultCookieOptions)

    res.status(200).json({ op: 'cancel-service' })
  } catch (error) {
    console.error(error)
    if (isApiRouteError(error)) {
      res.status(error.statusCode).json(error.formatResponseBody())
    } else {
      const newError = new ApiRouteError(500)
      res.status(500).json(newError.formatResponseBody())
    }
  }
}
