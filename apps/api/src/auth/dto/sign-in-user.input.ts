import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignInUserInput {
  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}
