import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ClaimChangingOwnEmailInput {
  @Field(() => String)
  newEmail: string
}
