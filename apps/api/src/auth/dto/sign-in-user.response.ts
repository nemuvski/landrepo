import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '$generated/user/user.model'

@ObjectType()
export class SignInUserResponse {
  @Field(() => String)
  access_token: string

  @Field(() => User)
  user: User
}
