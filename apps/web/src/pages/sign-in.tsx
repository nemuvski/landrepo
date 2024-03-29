import { Card } from '@mantine/core'
import SignInForm from '~/components/features/SignInForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { NextPage } from 'next'

const SignInPage: NextPage = () => {
  return (
    <ContentFirstLayout>
      <Meta pageName='サインイン' />

      <Card radius='md' shadow='sm' withBorder>
        <SignInForm />
        <InBoundButtonLink href='/sign-up' color='green'>
          サインアップする
        </InBoundButtonLink>
        <InBoundButtonLink href='/forgot-password' color='gray'>
          パスワードを忘れた
        </InBoundButtonLink>
      </Card>
    </ContentFirstLayout>
  )
}

export const getServerSideProps = withSession({
  routeGuard: {
    acceptRule: false,
    fallback: { redirect: { destination: '/', permanent: false } },
  },
})

export default SignInPage
