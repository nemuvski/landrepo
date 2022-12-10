import { trimGqlPrefixErrorMessage } from '@project/api-error'
import { datetime } from '@project/datetime'
import { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { useEffect, useRef, useState } from 'react'
import { gql } from 'urql'
import ApiRouteError, { isApiRouteError } from '~/exceptions/api-route.error'
import { useSessionUpdater } from '~/modules/auth'
import { COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '~/modules/auth/constants'
import { defaultCookieOptions } from '~/modules/cookie'
import { graphqlClient } from '~/modules/graphql'
import { axiosNextApiRoute } from '~/modules/http-client'
import type { Tokens } from '@project/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserEntity } from '~/entities/user.entity'
import type { Session } from '~/modules/auth'

/**
 * トークン再発行のハンドラを提供する
 */
export function useReissueTokenHandler(): [() => Promise<void>, { loading: boolean }] {
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
      const response = await axiosNextApiRoute.post<Session>(
        '/auth/reissue',
        {},
        {
          signal: abortController.current?.signal,
        }
      )
      updater(response.data)
    } catch (error) {
      console.error(error)
      updater(null)
      if (error instanceof AxiosError) {
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
 * @see /api/auth/reissue
 */
export async function reissueApiRoute(req: NextApiRequest, res: NextApiResponse) {
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

    const { data, error } = await graphqlClient({ token: refreshToken })
      .mutation<{ reissueTokens: Tokens & { user: UserEntity } }>(
        gql`
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
        `,
        {}
      )
      .toPromise()
    if (error || !data) {
      throw new ApiRouteError(401, trimGqlPrefixErrorMessage(error))
    } else {
      // クッキーに設定
      setCookie({ res }, COOKIE_NAME_ACCESS_TOKEN, data.reissueTokens.accessToken, {
        ...defaultCookieOptions,
        expires: datetime(data.reissueTokens.accessTokenExpiresIn).toDate(),
      })
      setCookie({ res }, COOKIE_NAME_REFRESH_TOKEN, data.reissueTokens.refreshToken, {
        ...defaultCookieOptions,
        expires: datetime(data.reissueTokens.refreshTokenExpiresIn).toDate(),
      })
    }

    const responseBody: Session = {
      accessToken: data.reissueTokens.accessToken,
      accessTokenExpiresIn: data.reissueTokens.accessTokenExpiresIn,
      user: data.reissueTokens.user,
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
