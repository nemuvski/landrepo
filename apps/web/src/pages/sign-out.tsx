import { Card } from '@mantine/core'
import { useEffect } from 'react'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import { useSignOutHandler } from '~/modules/auth/routes/sign-out'
import { InBoundButtonLink } from '~/modules/ui/Link'
import type { NextPage } from 'next'

const SignOutPage: NextPage = () => {
  const [signOut, { loading }] = useSignOutHandler()

  useEffect(
    () => {
      signOut()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <ContentFirstLayout>
      <Meta pageName='サインアウト' />

      <Card radius='md' shadow='sm' withBorder>
        <InBoundButtonLink href='/' loading={loading}>
          トップページへ
        </InBoundButtonLink>
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

export default SignOutPage
