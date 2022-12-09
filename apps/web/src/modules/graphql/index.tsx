import { initUrqlClient } from 'next-urql'
import { useMemo } from 'react'
import { Provider } from 'urql'
import { clientEnv } from '~/helpers/client-env.helper'
import type { RC } from '@itsumono/react'
import type { Session } from '~/modules/auth'

export function graphqlClient(
  options: {
    token?: string
    enableSuspense?: boolean
  } = {}
) {
  const { token, enableSuspense = false } = options
  const client = initUrqlClient(
    {
      url: clientEnv.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT,
      fetchOptions: () => {
        const headers: RequestInit['headers'] = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        return { headers }
      },
    },
    enableSuspense
  )
  if (!client) {
    throw new Error('Failed to initialize GraphQL client')
  }
  return client
}

const GraphQLProvider: RC.WithChildren<{ session?: Session | null }> = ({ session, children }) => {
  const client = useMemo(() => {
    return graphqlClient({ token: session?.accessToken })
  }, [session])
  return <Provider value={client}>{children}</Provider>
}

export default GraphQLProvider
