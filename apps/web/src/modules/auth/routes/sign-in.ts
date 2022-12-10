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
import type { AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserEntity } from '~/entities/user.entity'
import type { Session } from '~/modules/auth'

export type SignInMutationInput = { email: string; password: string }

/**
 * サインインのハンドラを提供する
 */
export function useSignInHandler(): [(input: SignInMutationInput) => Promise<void>, { loading: boolean }] {
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

  const handler = async (input: SignInMutationInput) => {
    setLoading(true)
    try {
      const response = await axiosNextApiRoute.post<Session, AxiosResponse<Session>, SignInMutationInput>(
        '/auth/sign-in',
        {
          ...input,
        },
        { signal: abortController.current?.signal }
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
 * @see /api/auth/sign-in
 */
export async function signInApiRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      throw new ApiRouteError(405)
    }

    // 既にアクセストークン類のクッキーが設定されている場合は処理しない
    const cookies = parseCookies({ req })
    if (cookies[COOKIE_NAME_ACCESS_TOKEN] || cookies[COOKIE_NAME_REFRESH_TOKEN]) {
      throw new ApiRouteError(403)
    }

    const { email, password } = req.body as Partial<SignInMutationInput>
    if (!email || !password) {
      throw new ApiRouteError(400)
    }

    const { data, error } = await graphqlClient()
      .mutation<{ signIn: Tokens & { user: UserEntity } }, SignInMutationInput>(
        gql`
          mutation ($email: String!, $password: String!) {
            signIn(input: { email: $email, password: $password }) {
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
        {
          email,
          password,
        }
      )
      .toPromise()
    if (error || !data) {
      throw new ApiRouteError(401, trimGqlPrefixErrorMessage(error))
    } else {
      // クッキーに設定
      setCookie({ res }, COOKIE_NAME_ACCESS_TOKEN, data.signIn.accessToken, {
        ...defaultCookieOptions,
        expires: datetime(data.signIn.accessTokenExpiresIn).toDate(),
      })
      setCookie({ res }, COOKIE_NAME_REFRESH_TOKEN, data.signIn.refreshToken, {
        ...defaultCookieOptions,
        expires: datetime(data.signIn.refreshTokenExpiresIn).toDate(),
      })
    }

    // クライアントサイドで扱うのはアクセストークンのみ (リフレッシュトークンはクッキーでのみ保持)
    const responseBody: Session = {
      accessToken: data.signIn.accessToken,
      accessTokenExpiresIn: data.signIn.accessTokenExpiresIn,
      user: data.signIn.user,
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
