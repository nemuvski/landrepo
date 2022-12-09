import { NextSeo } from 'next-seo'
import type { RC } from '@itsumono/react'

type Props = {
  pageType?: 'website' | 'article'
  pageName?: string
  description?: string
  noindex?: boolean
  nofollow?: boolean
}

/**
 * ページのメタ情報を設定する
 *
 * ※ noindex,nofollowはヘッダーで設定しているケースがあるので注意
 */
const Meta: RC.WithoutChildren<Props> = ({
  pageType = 'article',
  pageName,
  description,
  noindex = true,
  nofollow = true,
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
