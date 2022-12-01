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
        <InBoundButtonLink href='/sign-in'>サインイン</InBoundButtonLink>
      </Card>
    </ContentFirstLayout>
  )
}

export const getServerSideProps = withSession<{ hoge: number }>({
  routeGuard: {
    acceptRoles: { GENERAL: true, ADMIN: true },
    fallback: { redirect: { destination: '/sign-in', permanent: false } },
  },
  getServerSideProps: async (context, session) => {
    return { props: { hoge: 0 } }
  },
})

export default Home
