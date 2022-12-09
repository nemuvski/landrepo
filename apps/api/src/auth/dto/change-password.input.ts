import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  newPassword: string
}
