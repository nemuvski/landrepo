import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { CHECK_VALID_TOKEN_INTERVAL } from '~/modules/auth/constants'
import { useReissueTokenHandler } from '~/modules/auth/routes/reissue'
import { isNecessaryToReissueToken } from '~/modules/auth/utils'
import { JotaiDebugTool, JotaiProvider } from '~/modules/jotai'
import type { RC } from '@itsumono/react'
import type { AppProps } from 'next/app'
import type { UserEntity } from '~/entities/user.entity'

/**
 * @see {withSession()} 返値に含まれる_sessionが入る
 */
export type AppPropsWithSession = AppProps<{ session: Session | null | undefined }>

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
export const AuthSessionProvider: RC.WithChildren<{ initialSession?: Session | null }> = ({
  initialSession,
  children,
}) => {
  return (
    <JotaiProvider initialValues={[[sessionAtom, initialSession ?? null] as const]} scope={sessionAtomScope}>
      <JotaiDebugTool scope={sessionAtomScope} />
      <ValidTokenObserver />
      {children}
    </JotaiProvider>
  )
}

const ValidTokenObserver = () => {
  const session = useSession()
  const [reissueToken] = useReissueTokenHandler()

  useEffect(
    () => {
      if (session) {
        console.debug('[Session]', session)
        const timer = setInterval(() => {
          if (isNecessaryToReissueToken(session.accessTokenExpiresIn)) {
            reissueToken().catch((error) => {
              console.error(error)
            })
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
