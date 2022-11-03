import type { NextPageWithLayout } from '~/types/next'

const Home: NextPageWithLayout = () => {
  return <div>It works!</div>
}

Home.getLayout = (page) => {
  return <main>{page}</main>
}

export default Home
