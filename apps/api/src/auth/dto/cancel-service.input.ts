import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CancelServiceInput {
  @Field(() => String)
  password: string
}
