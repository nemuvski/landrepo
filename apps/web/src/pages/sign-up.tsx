import { Card } from '@mantine/core'
import SignUpForm from '~/components/features/SignUpForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import type { NextPage } from 'next'

const SignInPage: NextPage = () => {
  return (
    <ContentFirstLayout>
      <Meta pageName='サインアップ' />

      <Card radius='md' shadow='sm' withBorder>
        <SignUpForm />
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
