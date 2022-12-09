import { Card } from '@mantine/core'
import ClaimChangingPasswordForm from '~/components/features/ClaimChangingPasswordForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import type { NextPage } from 'next'

const ForgotPasswordPage: NextPage = () => {
  return (
    <ContentFirstLayout>
      <Meta pageName='パスワードを忘れた' />

      <Card radius='md' shadow='sm' withBorder>
        <ClaimChangingPasswordForm />
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

export default ForgotPasswordPage
