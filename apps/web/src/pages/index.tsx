import { Card } from '@mantine/core'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { GetServerSideProps, NextPage } from 'next'

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

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { session: { hoge: 'string' } } }
}

export default Home
