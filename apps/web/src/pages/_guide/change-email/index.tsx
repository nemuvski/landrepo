import ContentFirstLayout from '~/components/layouts/ContentFirstLayout'
import Meta from '~/components/Meta'
import type { NextPage } from 'next'

type ServerSideResult = {}

const GuideChangeEmailPage: NextPage<ServerSideResult> = () => {
  return (
    <ContentFirstLayout>
      <Meta nofollow noindex />
    </ContentFirstLayout>
  )
}

export default GuideChangeEmailPage