import { isString } from '@itsumono/utils'
import { Card } from '@mantine/core'
import { PARAM_NAME_TOKEN } from '@project/auth'
import { gql } from 'urql'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import withSession from '~/modules/auth/middlewares/with-session'
import { isOwnOneTimeToken } from '~/modules/auth/utils'
import { graphqlClient } from '~/modules/graphql'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { NextPage } from 'next'

type ServerSideResult = {
  isValidToken: boolean
}

const GuideChangeEmailPage: NextPage<ServerSideResult> = ({ isValidToken }) => {
  return (
    <ContentFirstLayout>
      <Card radius='md' shadow='sm' withBorder>
        {isValidToken
          ? 'メールアドレス変更手続きが完了しました。'
          : '無効なトークンです。もう一度メールアドレス変更の手続きをしてください。'}
        <InBoundButtonLink href='/' replace>
          トップへ
        </InBoundButtonLink>
      </Card>
    </ContentFirstLayout>
  )
}

export const getServerSideProps = withSession<ServerSideResult>({
  routeGuard: {
    acceptRule: true,
    fallback: { notFound: true },
  },
  getServerSideProps: async (context, session) => {
    try {
      const token = context.query[PARAM_NAME_TOKEN]
      if (!isString(token) || !token) {
        return { notFound: true }
      }

      // routeGuardのルールでsessionがあることは保証されているが、lintエラー回避のため
      if (session && !isOwnOneTimeToken(token, session)) {
        return { notFound: true }
      }

      const { error } = await graphqlClient({
        token,
      })
        .mutation(
          gql`
            mutation {
              verifyTokenAtChangeEmail
            }
          `,
          {}
        )
        .toPromise()
      if (error) {
        throw new Error(error.message)
      }
      return { props: { isValidToken: true } }
    } catch (error) {
      console.error(error)
      return { props: { isValidToken: false } }
    }
  },
})

export default GuideChangeEmailPage
