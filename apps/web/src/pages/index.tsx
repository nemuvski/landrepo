import { Card, Stack } from '@mantine/core'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <ContentFirstLayout>
      <Meta pageName='ホーム' />

      <Card radius='md' shadow='sm' withBorder>
        <Stack spacing='lg'>
          <InBoundButtonLink href='/settings/change-email'>メールアドレス変更</InBoundButtonLink>
          <InBoundButtonLink href='/settings/change-password'>パスワード変更</InBoundButtonLink>
          <InBoundButtonLink href='/settings/cancel' color='red' variant='outline'>
            退会
          </InBoundButtonLink>
          <InBoundButtonLink href='/sign-out' color='gray'>
            サインアウト
          </InBoundButtonLink>
        </Stack>
      </Card>
    </ContentFirstLayout>
  )
}

export const getServerSideProps = withSession({
  routeGuard: {
    acceptRule: true,
    fallback: { redirect: { destination: '/sign-in', permanent: false } },
  },
})

export default Home
