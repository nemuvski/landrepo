import { Container, Group } from '@mantine/core'
import Meta from '~/components/Meta'
import { InBoundButtonLink, InBoundLink, OutBoundButtonLink, OutBoundLink } from '~/modules/ui/Link'
import type { NextPageWithLayout } from '~/types/next'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Meta pageName='ホーム' />

      <Container>
        <Group spacing='md'>
          <InBoundLink href='/'>テスト</InBoundLink>
          <InBoundButtonLink href='/'>テスト</InBoundButtonLink>
          <OutBoundLink href='https://example.com'>テスト</OutBoundLink>
          <OutBoundButtonLink href={new URL('https://example.com')}>テスト</OutBoundButtonLink>
        </Group>
      </Container>
    </>
  )
}

Home.getLayout = (page) => {
  return <main>{page}</main>
}

export default Home
