import { Either } from '@itsumono/react'
import { isString } from '@itsumono/utils'
import { Card } from '@mantine/core'
import { PARAM_NAME_TOKEN } from '@project/auth'
import { gql } from 'urql'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import { graphqlClient } from '~/modules/graphql'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { NextPage } from 'next'

type ServerSideResult = {
  isValidToken: boolean
}

const GuideSignUpConfirmationPage: NextPage<ServerSideResult> = ({ isValidToken }) => {
  console.log(isValidToken)
  return (
    <ContentFirstLayout>
      <Meta nofollow noindex />

      <Card radius='md' shadow='sm' withBorder>
        <Either
          test={isValidToken}
          match={
            <>
              新規登録が完了しました。
              <InBoundButtonLink href='/sign-in' replace>
                サインイン
              </InBoundButtonLink>
            </>
          }
          not={
            <>
              無効なトークンです。もう一度新規登録をしてください。
              <InBoundButtonLink href='/sign-up' replace>
                新規登録
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
      // セッションが貼られてる場合は404とする
      if (session) {
        return { notFound: true }
      }

      const token = context.query[PARAM_NAME_TOKEN]
      if (!isString(token) || !token) {
        return { notFound: true }
      }

      const { error } = await graphqlClient({ token })
        .mutation(
          gql`
            mutation {
              verifyTokenAtSignUp
            }
          `,
          {}
        )
        .toPromise()

      if (error) {
        throw new Error('無効なトークンです')
      }
      return { props: { isValidToken: true } }
    } catch (error) {
      console.error(error)
      return { props: { isValidToken: false } }
    }
  },
})

export default GuideSignUpConfirmationPage
