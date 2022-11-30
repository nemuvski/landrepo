import { parseCookies } from 'nookies'
import { gql } from 'urql'
import { COOKIE_NAME_ACCESS_TOKEN } from '~/modules/auth/constants'
import { graphqlClient } from '~/modules/graphql'
import type { Tokens } from '@project/jwt'
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { UserEntity } from '~/entities/user.entity'
import type { Session } from '~/modules/auth'

type Options<R extends {} = {}> = {
  // 認証済みユーザーのみがアクセスするルートの場合はTrueを設定
  requiredAuth?: boolean
  getServerSideProps?: (
    context: GetServerSidePropsContext,
    session: Session | null
  ) => Promise<GetServerSidePropsResult<R>>
}

function withSession<R extends {} = {}>(
  options: Options<R> = {}
): Promise<GetServerSidePropsResult<R & { session?: Session | null }>> {
  const { requiredAuth = false, getServerSideProps: nextGetServerSideProps } = options

  const middleware: GetServerSideProps = async (context) => {
    const { req } = context

    const cookies = parseCookies({ req })
    const accessToken = cookies[COOKIE_NAME_ACCESS_TOKEN]

    // TODO: accessTokenがある場合はverifySession実行

    try {
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

      if (!data || error) {
        throw new Error('')
      }

      const session: Session = {
        accessToken,
        accessTokenExpiresIn: data.verifySession.accessTokenExpiresIn,
        user: data.verifySession.user,
      }

      let nextProps: GetServerSideProps<R> = {}
      if (nextGetServerSideProps) {
        nextProps = await nextGetServerSideProps(context, session)
      }
      // TODO: nextPropsの内容を
      return { ...nextProps, props: { ...nextProps.props, session } }
    } catch (error) {
      console.error(error)
      return { notFound: true }
    }
  }
  return middleware
}

export default withSession
