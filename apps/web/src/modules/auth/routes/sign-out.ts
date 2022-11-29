import { destroyCookie, parseCookies } from 'nookies'
import { useEffect, useRef, useState } from 'react'
import { gql } from 'urql'
import ApiRouteError, { isApiRouteError } from '~/exceptions/api-route.error'
import { useSessionUpdater } from '~/modules/auth'
import { COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '~/modules/auth/constants'
import { defaultCookieOptions } from '~/modules/cookie'
import { graphqlClient } from '~/modules/graphql'
import { axiosNextApiRoute } from '~/modules/http-client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiRouteErrorResponse } from '~/exceptions/api-route.error'

/**
 * サインアウトのハンドラを提供する
 */
export function useSignOutHandler(): [() => Promise<void>, { loading: boolean; error: ApiRouteErrorResponse | null }] {
  const updater = useSessionUpdater()
  const abortController = useRef<AbortController | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiRouteErrorResponse | null>(null)

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
    setError(null)
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
      if (isApiRouteError(error)) {
        setError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return [handler, { loading, error }]
}

/**
 * @see /api/auth/sign-out
 */
export async function signOutApiRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
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
    // FIXME: 問題ないようなリクエストでも401になっている (バックエンド側の問題かもしれない)
    if (error) {
      throw new ApiRouteError(401)
    }

    // アクセストークン関連のクッキーを破棄
    // NOTE: 削除する際はオプションにpathを設定しておくこと
    destroyCookie({ res }, COOKIE_NAME_ACCESS_TOKEN, defaultCookieOptions)
    destroyCookie({ res }, COOKIE_NAME_REFRESH_TOKEN, defaultCookieOptions)

    res.status(204).json({})
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
