import { Field, ObjectType } from '@nestjs/graphql'
import type { Tokens } from '@project/auth'
import { User } from '$/nestgraphql'

@ObjectType()
export class VerifySessionResponse implements Pick<Tokens, 'accessTokenExpiresIn'> {
  @Field(() => String)
  accessTokenExpiresIn: string

  @Field(() => User)
  user: User
}
