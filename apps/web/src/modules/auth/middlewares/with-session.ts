import { isBoolean } from '@itsumono/utils'
import { parseCookies } from 'nookies'
import { gql } from 'urql'
import { COOKIE_NAME_ACCESS_TOKEN } from '~/modules/auth/constants'
import { graphqlClient } from '~/modules/graphql'
import type { Tokens } from '@project/auth'
import type { UserRole } from '@project/database'
import type { GetServerSideProps } from 'next'
import type { GetServerSidePropsContext, GetServerSidePropsResult, Redirect } from 'next'
import type { PreviewData } from 'next/types'
import type { ParsedUrlQuery } from 'querystring'
import type { UserEntity } from '~/entities/user.entity'
import type { Session } from '~/modules/auth'

function isNotFoundReturnObj(obj: Record<string, any>): obj is { notFound: true } {
  // NOTE: obj.notFoundで値が真値かもチェックしている
  return 'notFound' in obj && obj.notFound
}

function isRedirectReturnObj(obj: Record<string, any>): obj is { redirect: Redirect } {
  // NOTE: obj.redirect.destinationが必須なので、値があるかもチェック
  return 'redirect' in obj && !!obj.redirect.destination
}

type WithSessionOptions<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = {
  // routeGuard未指定の場合はアクセス制限しない
  routeGuard?: {
    // 許可するUserRoleを指定 (trueの場合はログインしているユーザーのみ許可, falseの場合はログインしていないユーザーのみ許可)
    acceptRule: boolean | Record<UserRole, boolean | undefined>
    // ガードではじかれた場合の挙動の設定
    fallback: { notFound: true } | { redirect: Redirect }
  }
  getServerSideProps?: (
    context: GetServerSidePropsContext<Q, D>,
    session: Session | null
  ) => Promise<GetServerSidePropsResult<P>>
}

function withSession<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
>(options: WithSessionOptions<P, Q, D> = {}) {
  const { routeGuard, getServerSideProps: nextGetServerSideProps } = options

  const middleware: GetServerSideProps<P & { session: Session | null }, Q, D> = async (context) => {
    const { req } = context

    const cookies = parseCookies({ req })
    const accessToken = cookies[COOKIE_NAME_ACCESS_TOKEN]

    try {
      let session: Session | null = null

      // アクセストークンがある場合は検証する
      if (accessToken) {
        const { data, error } = await graphqlClient({ token: accessToken })
          .mutation<{
            verifySession: Pick<Tokens, 'accessTokenExpiresIn'> & { user: UserEntity }
          }>(
            gql`
              mutation {
                verifySession {
                  accessTokenExpiresIn
                  user {
                    id
                    email
                    role
                  }
                }
              }
            `,
            {}
          )
          .toPromise()
        // NOTE: クッキーがある場合に、事前にmiddlewareにてトークンチェックはしているため、基本的に問題ないはずではある
        if (!data || error) {
          throw new Error('アクセストークンが無効であるか、ネットワークエラーです')
        }
        session = {
          accessToken,
          accessTokenExpiresIn: data.verifySession.accessTokenExpiresIn,
          user: data.verifySession.user,
        }
      }

      // ルートガードの指定がある場合は、許可のある閲覧者かを判定する
      if (routeGuard) {
        if (isBoolean(routeGuard.acceptRule)) {
          /**
           * [真偽値の場合]
           * - ルールの値がTrueの場合は、sessionがあればOK
           * - ルールの値がFalseの場合は、sessionがなければOK
           */
          if ((routeGuard.acceptRule && !session) || (!routeGuard.acceptRule && session)) {
            return routeGuard.fallback
          }
        } else {
          if (!session || !routeGuard.acceptRule[session.user.role]) {
            return routeGuard.fallback
          }
        }
      }

      if (nextGetServerSideProps) {
        const res = await nextGetServerSideProps(context, session)
        if (isNotFoundReturnObj(res) || isRedirectReturnObj(res)) {
          return res
        }
        return { props: { ...res.props, session } } as GetServerSidePropsResult<P & { session: Session | null }>
      }

      return { props: { session } } as GetServerSidePropsResult<P & { session: Session | null }>
    } catch (error) {
      console.error(error)
      return { notFound: true }
    }
  }

  return middleware
}

export default withSession
