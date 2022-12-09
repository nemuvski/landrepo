import { Card } from '@mantine/core'
import ClaimChangingEmailForm from '~/components/features/ClaimChangingEmailForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import { useSession } from '~/modules/auth'
import withSession from '~/modules/auth/middlewares/with-session'
import type { NextPage } from 'next'

const SettingsChangeEmailPage: NextPage = () => {
  const session = useSession()

  if (!session) {
    return null
  }

  return (
    <ContentFirstLayout>
      <Meta pageName='メールアドレス変更' />

      <Card radius='md' shadow='sm' withBorder>
        <ClaimChangingEmailForm currentEmail={session.user.email} />
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

export default SettingsChangeEmailPage
