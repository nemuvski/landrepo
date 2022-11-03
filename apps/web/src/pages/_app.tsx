import { DefaultSeo } from 'next-seo'
import { clientEnv } from '~/helpers/client-env'
import { getSiteUrlWithPath } from '~/helpers/urls'
import type { AppPropsWithLayout } from '~/types/next'

const siteName = clientEnv.NEXT_PUBLIC_SITE_NAME
const siteUrl = getSiteUrlWithPath()
const appVersion = clientEnv.APP_VERSION

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
          { name: 'application-version', content: appVersion },
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
