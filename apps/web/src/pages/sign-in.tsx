import { Card } from '@mantine/core'
import SignInForm from '~/components/features/SignInForm'
import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import type { NextPage } from 'next'

const SignInPage: NextPage = () => {
  return (
    <ContentFirstLayout>
      <Meta pageName='サインイン' />

      <Card radius='md' shadow='sm' withBorder>
        <SignInForm />
      </Card>
    </ContentFirstLayout>
  )
}

export default SignInPage
