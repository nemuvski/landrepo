import { Card } from '@mantine/core'
import ClaimChangingPasswordForm from '~/components/features/ClaimChangingPasswordForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import { useSession } from '~/modules/auth'
import withSession from '~/modules/auth/middlewares/with-session'
import type { NextPage } from 'next'

const SettingsChangePasswordPage: NextPage = () => {
  const session = useSession()

  return (
    <ContentFirstLayout>
      <Meta pageName='パスワード変更' />

      <Card radius='md' shadow='sm' withBorder>
        <ClaimChangingPasswordForm currentEmail={session?.user.email} />
      </Card>
    </ContentFirstLayout>
  )
}

export const getServerSideProps = withSession({
  routeGuard: {
    acceptRule: true,
    fallback: { notFound: true },
  },
})

export default SettingsChangePasswordPage
