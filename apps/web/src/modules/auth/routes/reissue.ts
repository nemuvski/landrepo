import { datetime } from '@project/datetime'
import { parseCookies, setCookie } from 'nookies'
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
import type { Session } from '~/modules/auth'
import type { SignInMutationOutput } from '~/modules/auth/routes/sign-in'

const mutation = gql`
  mutation {
    reissueTokens {
      user {
        id
        email
        role
      }
      accessToken
      refreshToken
      accessTokenExpiresIn
      refreshTokenExpiresIn
    }
  }
`

/**
 * トークン再発行のハンドラを提供する
 */
export function useReissueTokenHandler(): [
  () => Promise<void>,
  { loading: boolean; error: ApiRouteErrorResponse | null }
] {
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
      const response = await axiosNextApiRoute.post<never, Session>(
        '/auth/reissue',
        {},
        {
          signal: abortController.current?.signal,
        }
      )
      updater(response)
    } catch (error) {
      if (isApiRouteError(error)) {
        setError(error)
      }
      updater(null)
    } finally {
      setLoading(false)
    }
  }

  return [handler, { loading, error }]
}

/**
 * @see /api/auth/reissue
 */
export async function reissueApiRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    // リフレッシュトークンがあれば良い
    const cookies = parseCookies({ req })
    const refreshToken = cookies[COOKIE_NAME_REFRESH_TOKEN]
    if (!refreshToken) {
      throw new ApiRouteError(403)
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      throw new ApiRouteError(405)
    }

    const { data, error } = await graphqlClient({ token: refreshToken })
      .mutation<SignInMutationOutput>(mutation, {})
      .toPromise()
    if (error || !data) {
      throw new ApiRouteError(401)
    } else {
      // クッキーに設定
      setCookie({ res }, COOKIE_NAME_ACCESS_TOKEN, data.accessToken, {
        ...defaultCookieOptions,
        expires: datetime(data.accessTokenExpiresIn).toDate(),
      })
      setCookie({ res }, COOKIE_NAME_REFRESH_TOKEN, data.refreshToken, {
        ...defaultCookieOptions,
        expires: datetime(data.refreshTokenExpiresIn).toDate(),
      })
    }

    const responseBody: Session = {
      accessToken: data.accessToken,
      accessTokenExpiresIn: data.accessTokenExpiresIn,
      user: data.user,
    }

    res.status(200).json(responseBody)
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
