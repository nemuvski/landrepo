import Head from 'next/head'
import type { NextPageWithLayout } from '~/types/next'

const Home: NextPageWithLayout = () => {
  return <div>It works!</div>
}

Home.getLayout = (page) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='format-detection' content='telephone=no, email=no, address=no' />
        <meta name='description' content='Next App' />
        <meta name='ui-version' content={process.env.APP_VERSION} />
        <title>Next App</title>
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      </Head>

      <main>{page}</main>
    </>
  )
}

export default Home
