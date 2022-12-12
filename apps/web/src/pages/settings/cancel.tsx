import { Card } from '@mantine/core'
import CancelServiceForm from '~/components/features/CancelServiceForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import withSession from '~/modules/auth/middlewares/with-session'
import type { NextPage } from 'next'

const SettingsCancelPage: NextPage = () => {
  return (
    <ContentFirstLayout>
      <Meta pageName='退会' />

      <Card radius='md' shadow='sm' withBorder>
        <CancelServiceForm />
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

export default SettingsCancelPage
