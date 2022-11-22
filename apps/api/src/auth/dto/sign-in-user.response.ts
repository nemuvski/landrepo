import { Field, ObjectType } from '@nestjs/graphql'
import type { Tokens } from '@project/jwt'
import { User } from '$/nestgraphql'

@ObjectType()
export class SignInUserResponse implements Tokens {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string

  @Field(() => User)
  user: User
}
