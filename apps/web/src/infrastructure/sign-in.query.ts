import { gql } from 'urql'
import type { Tokens } from '@project/jwt'
import type { UserEntity } from '~/entities/user.entity'

export type SignInMutationOutput = Tokens & { user: UserEntity }

export type SignInMutationInput = { email: string; password: string }

export const signInMutation = gql`
  mutation ($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        id
        email
        role
      }
      accessToken
      refreshToken
    }
  }
`
