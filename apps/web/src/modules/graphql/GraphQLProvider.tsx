import { Provider } from 'urql'
import { graphqlClient } from '~/modules/graphql/graphql-client'
import type { RC } from '@itsumono/react'

const client = graphqlClient()

const GraphQLProvider: RC.WithChildren = ({ children }) => {
  return <Provider value={client}>{children}</Provider>
}

export default GraphQLProvider
