import { Card } from '@mantine/core'
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
        ログインしている
        <br />
        <InBoundButtonLink href='/sign-out'>サインアウト</InBoundButtonLink>
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
