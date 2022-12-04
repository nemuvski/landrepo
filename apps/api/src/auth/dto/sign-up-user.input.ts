import { Field, InputType } from '@nestjs/graphql'
import { UserRole } from '@project/database'

@InputType()
export class SignUpUserInput {
  @Field()
  email: string

  @Field()
  password: string

  @Field({ nullable: true })
  role?: UserRole
}
