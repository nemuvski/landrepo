import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
  @Field(() => String)
  id: string

  @Field(() => String)
  username: string

  @Field(() => String)
  password: string
}
