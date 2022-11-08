import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '$nestgraphql/user/user.model'

@ObjectType()
export class SignInUserResponse {
  @Field(() => String)
  access_token: string

  @Field(() => User)
  user: User
}
