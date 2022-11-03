import { NextSeo } from 'next-seo'
import type { RC } from '@itsumono/react'

type Props = {
  pageType?: 'website' | 'article'
  pageName?: string
  description?: string
  noindex?: boolean
  nofollow?: boolean
}

const Meta: RC.WithoutChildren<Props> = ({
  pageType = 'article',
  pageName,
  description,
  noindex = false,
  nofollow = false,
}) => {
  return (
    <NextSeo
      title={pageName}
      description={description}
      openGraph={{ description, type: pageType, title: pageName }}
      noindex={noindex}
      nofollow={nofollow}
    />
  )
}

export default Meta
