import {
  completeNavigationProgress,
  NavigationProgress as MantineNavigationProgress,
  startNavigationProgress,
} from '@mantine/nprogress'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * @see {@link https://mantine.dev/others/nprogress/}
 */
const NavigationProgress = () => {
  const router = useRouter()

  useEffect(
    () => {
      const handleStart = (url: string) => url !== router.asPath && startNavigationProgress()
      const handleComplete = () => completeNavigationProgress()

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError', handleComplete)

      return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleComplete)
        router.events.off('routeChangeError', handleComplete)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  )

  return <MantineNavigationProgress progressLabel='Loading Page' />
}

export default NavigationProgress
