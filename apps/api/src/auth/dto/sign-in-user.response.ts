import { Field, ObjectType } from '@nestjs/graphql'
import type { Tokens } from '@project/auth'
import { User } from '$/nestgraphql'

@ObjectType()
export class SignInUserResponse implements Tokens {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string

  @Field(() => String)
  accessTokenExpiresIn: string

  @Field(() => String)
  refreshTokenExpiresIn: string

  @Field(() => User)
  user: User
}
