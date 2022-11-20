import { initUrqlClient } from 'next-urql'
import { clientEnv } from '~/helpers/client-env.helper'

type Options = {
  token?: string
  enableSuspense?: boolean
}

export function graphqlClient(options: Options = {}) {
  const { token, enableSuspense = false } = options

  const client = initUrqlClient(
    {
      url: clientEnv.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT,
      fetchOptions: () => {
        const headers: RequestInit['headers'] = []
        if (token) {
          headers.push(['Authorization', `Bearer ${token}`])
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
