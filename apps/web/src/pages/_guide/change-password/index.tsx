import { Either } from '@itsumono/react'
import { isString } from '@itsumono/utils'
import { Card, Text } from '@mantine/core'
import { PARAM_NAME_TOKEN } from '@project/auth'
import { gql } from 'urql'
import ChangePasswordForm from '~/components/features/ChangePasswordForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import withSession from '~/modules/auth/middlewares/with-session'
import { isOwnOneTimeToken } from '~/modules/auth/utils'
import { graphqlClient } from '~/modules/graphql'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { NextPage } from 'next'

type ServerSideResult = {
  isValidToken: boolean
  oneTimeToken: string
}

const GuideChangePasswordPage: NextPage<ServerSideResult> = ({ isValidToken, oneTimeToken }) => {
  return (
    <ContentFirstLayout>
      <Card radius='md' shadow='sm' withBorder>
        <Either
          test={isValidToken}
          match={<ChangePasswordForm oneTimeToken={oneTimeToken} />}
          not={
            <>
              <Text>無効なトークンです。もう一度パスワード変更の手続きをしてください。</Text>
              <InBoundButtonLink href='/' replace>
                トップへ
              </InBoundButtonLink>
            </>
          }
        />
      </Card>
    </ContentFirstLayout>
  )
}

export const getServerSideProps = withSession<ServerSideResult>({
  getServerSideProps: async (context, session) => {
    try {
      const token = context.query[PARAM_NAME_TOKEN]
      if (!isString(token) || !token) {
        return { notFound: true }
      }

      // 既にセッションのある閲覧者の場合は、自身向けのトークンであるかをチェックする
      if (session && !isOwnOneTimeToken(token, session)) {
        return { notFound: true }
      }

      const { error } = await graphqlClient({
        token,
      })
        .mutation(
          gql`
            mutation {
              verifyTokenAtChangePassword
            }
          `,
          {}
        )
        .toPromise()
      if (error) {
        throw new Error(error.message)
      }
      return { props: { isValidToken: true, oneTimeToken: token } }
    } catch (error) {
      console.error(error)
      return { props: { isValidToken: false, oneTimeToken: '' } }
    }
  },
})

export default GuideChangePasswordPage
