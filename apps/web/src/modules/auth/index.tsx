import { datetime } from '@project/datetime'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { CHECK_VALID_TOKEN_INTERVAL, EXPIRY_MARGIN } from '~/modules/auth/constants'
import { useReissueTokenHandler } from '~/modules/auth/routes/reissue'
import { JotaiDebugTool, JotaiProvider } from '~/modules/jotai'
import type { UserEntity } from '~/entities/user.entity'

export interface Session {
  accessToken: string
  accessTokenExpiresIn: string
  user: UserEntity
}
const sessionAtomScope = Symbol('session')
const sessionAtom = atom<Session | null>(null)

/**
 * SessionStateを取得するフック
 */
export function useSession() {
  return useAtomValue(sessionAtom, sessionAtomScope)
}

/**
 * SessionStateを更新するハンドラを提供するフック
 */
export function useSessionUpdater() {
  return useSetAtom(sessionAtom, sessionAtomScope)
}

/**
 * 認証関連の処理のプロバイダー
 */
export const AuthSessionProvider: typeof JotaiProvider = ({ children, initialValues }) => {
  return (
    <JotaiProvider initialValues={initialValues} scope={sessionAtomScope}>
      <JotaiDebugTool scope={sessionAtomScope} />
      <ValidTokenObserver />
      {children}
    </JotaiProvider>
  )
}

const ValidTokenObserver = () => {
  const session = useSession()
  const [reissueToken, { error }] = useReissueTokenHandler()

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  useEffect(
    () => {
      if (session) {
        const timer = setInterval(() => {
          // 失効前に (margin設定)
          if (datetime(session.accessTokenExpiresIn).diff(datetime(), 'ms') <= EXPIRY_MARGIN) {
            reissueToken()
          }
        }, CHECK_VALID_TOKEN_INTERVAL)

        return () => {
          clearInterval(timer)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session]
  )

  return null
}
