import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

/**
 * @see {@link https://nextjs.org/docs/basic-features/layouts#with-typescript}
 */
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
export type AppPropsWithLayout<P = {}> = AppProps<P> & {
  Component: NextPageWithLayout
}
