import Meta from '~/components/Meta'
import type { NextPageWithLayout } from '~/types/next'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Meta pageName='ホーム' />

      <div>It works!</div>
    </>
  )
}

Home.getLayout = (page) => {
  return <main>{page}</main>
}

export default Home
