import { trimGqlPrefixErrorMessage } from '@project/api-error'
import { destroyCookie, parseCookies } from 'nookies'
import { useEffect, useRef, useState } from 'react'
import { gql } from 'urql'
import ApiRouteError, { isApiRouteError } from '~/exceptions/api-route.error'
import { useSessionUpdater } from '~/modules/auth'
import { COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '~/modules/auth/constants'
import { defaultCookieOptions } from '~/modules/cookie'
import { graphqlClient } from '~/modules/graphql'
import { axiosNextApiRoute, AxiosError } from '~/modules/http-client'
import { getRateLimitToken, rateLimit } from '~/modules/rate-limit'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * サインアウトのハンドラを提供する
 */
export function useSignOutHandler(): [() => Promise<void>, { loading: boolean }] {
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

  const handler = async () => {
    setLoading(true)
    try {
      await axiosNextApiRoute.post(
        '/auth/sign-out',
        {},
        {
          signal: abortController.current?.signal,
        }
      )
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
 * @see /api/auth/sign-out
 */
export async function signOutApiRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    rateLimit.check(res, getRateLimitToken(req))

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

    const { error } = await graphqlClient({ token: refreshToken })
      .mutation<{}, {}>(
        gql`
          mutation {
            signOut
          }
        `,
        {}
      )
      .toPromise()
    if (error) {
      throw new ApiRouteError(401, trimGqlPrefixErrorMessage(error))
    }

    // アクセストークン関連のクッキーを破棄
    // NOTE: 削除する際はオプションにpathを設定しておくこと
    destroyCookie({ res }, COOKIE_NAME_ACCESS_TOKEN, defaultCookieOptions)
    destroyCookie({ res }, COOKIE_NAME_REFRESH_TOKEN, defaultCookieOptions)

    res.status(200).json({ op: 'sign-out' })
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
