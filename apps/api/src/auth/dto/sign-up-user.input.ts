import { Field, InputType } from '@nestjs/graphql'
import { UserRole } from '@project/database'

@InputType()
export class SignUpUserInput {
  @Field(() => String)
  email: string

  @Field(() => String)
  password: string

  @Field(() => String, { nullable: true })
  role?: UserRole
}
