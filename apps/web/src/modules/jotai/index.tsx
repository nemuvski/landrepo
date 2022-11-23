import { Provider } from 'jotai'
import { useAtomsDebugValue } from 'jotai/devtools'
import { isDevelopmentEnv } from '~/helpers/env.helper'
import type { RC } from '@itsumono/react'

/**
 * jotaiのScope型
 */
export type JotaiScope = symbol | string | number

/**
 * jotaiのProvider
 */
export const JotaiProvider: typeof Provider = ({ children, ...props }) => {
  return <Provider {...props}>{children}</Provider>
}

/**
 * jotaiデバッグツール
 *
 * @see {@link https://jotai.org/docs/api/devtools}
 */
export const JotaiDebugTool: RC.WithoutChildren<{
  scope?: JotaiScope
}> = ({ scope }) => {
  useAtomsDebugValue({
    scope,
    enabled: isDevelopmentEnv(),
  })
  return null
}
