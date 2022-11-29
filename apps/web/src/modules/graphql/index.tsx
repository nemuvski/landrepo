import { initUrqlClient } from 'next-urql'
import { Provider } from 'urql'
import { clientEnv } from '~/helpers/client-env.helper'
import type { RC } from '@itsumono/react'

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

const client = graphqlClient()

const GraphQLProvider: RC.WithChildren = ({ children }) => {
  return <Provider value={client}>{children}</Provider>
}

export default GraphQLProvider
