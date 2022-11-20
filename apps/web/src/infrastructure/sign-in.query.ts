import { gql } from 'urql'
import type { UserEntity } from '~/entities/user.entity'
import type { Tokens } from '~/types/token'

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
