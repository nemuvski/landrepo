import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ClaimChangingPasswordInput {
  @Field(() => String)
  email: string
}
