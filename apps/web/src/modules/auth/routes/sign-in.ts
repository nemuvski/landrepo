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
import type { Tokens } from '@project/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserEntity } from '~/entities/user.entity'
import type { ApiRouteErrorResponse } from '~/exceptions/api-route.error'
import type { Session } from '~/modules/auth'

export type SignInMutationOutput = Tokens & { user: UserEntity }

export type SignInMutationInput = { email: string; password: string }

const mutation = gql`
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
`

/**
 * サインインのハンドラを提供する
 */
export function useSignInHandler(): [
  (input: SignInMutationInput) => Promise<void>,
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

  const handler = async (input: SignInMutationInput) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosNextApiRoute.post<SignInMutationInput, Session>(
        '/auth/sign-in',
        {
          ...input,
        },
        { signal: abortController.current?.signal }
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
 * @see /api/auth/sign-in
 */
export async function signInApiRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 既にアクセストークン類のクッキーが設定されている場合は処理しない
    const cookies = parseCookies({ req })
    if (cookies[COOKIE_NAME_ACCESS_TOKEN] || cookies[COOKIE_NAME_REFRESH_TOKEN]) {
      throw new ApiRouteError(403)
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      throw new ApiRouteError(405)
    }

    const { email, password } = req.body as Partial<SignInMutationInput>
    if (!email || !password) {
      throw new ApiRouteError(400)
    }

    const { data, error } = await graphqlClient()
      .mutation<SignInMutationOutput, SignInMutationInput>(mutation, {
        email,
        password,
      })
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

    // クライアントサイドで扱うのはアクセストークンのみ (リフレッシュトークンはクッキーでのみ保持)
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
