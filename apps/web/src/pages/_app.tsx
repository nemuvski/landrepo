import { DefaultSeo } from 'next-seo'
import { clientEnv } from '~/helpers/client-env.helper'
import { getSiteUrlWithPath } from '~/helpers/urls.helper'
import { AuthSessionProvider, type AppPropsWithSession } from '~/modules/auth'
import GraphQLProvider from '~/modules/graphql'
import UIProvider from '~/modules/ui/UIProvider'

const siteName = clientEnv.NEXT_PUBLIC_SITE_NAME
const siteUrl = getSiteUrlWithPath()
const appVersion = clientEnv.APP_VERSION

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithSession) => {
  return (
    <AuthSessionProvider initialSession={session}>
      <DefaultSeo
        titleTemplate={`%s – ${siteName}`}
        defaultTitle={siteName}
        description=''
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'format-detection', content: 'telephone=no, email=no, address=no' },
          { name: 'application-version', content: appVersion },
          { name: 'robots', content: 'noarchive,noodp' },
        ]}
        additionalLinkTags={[{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]}
        canonical={siteUrl}
        twitter={{ cardType: 'summary' }}
        openGraph={{
          siteName,
          type: 'website',
          url: siteUrl,
          description: '',
          locale: 'ja_JP',
          images: [],
        }}
      />

      <GraphQLProvider session={session}>
        <UIProvider>
          <Component {...pageProps} />
        </UIProvider>
      </GraphQLProvider>
    </AuthSessionProvider>
  )
}

export default MyApp
