import { DefaultSeo } from 'next-seo'
import type { AppPropsWithLayout } from '~/types/next'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <DefaultSeo
        titleTemplate={`%s – ${siteName}`}
        defaultTitle={siteName}
        description=''
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'format-detection', content: 'telephone=no, email=no, address=no' },
          { name: 'application-version', content: process.env.APP_VERSION },
        ]}
        additionalLinkTags={[{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]}
        canonical={siteUrl}
        twitter={{ cardType: 'summary' }}
        openGraph={{
          site_name: siteName,
          type: 'website',
          url: siteUrl,
          description: '',
          locale: 'ja_JP',
          images: [],
        }}
      />

      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
