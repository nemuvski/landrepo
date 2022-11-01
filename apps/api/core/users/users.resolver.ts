import { Query, Resolver } from '@nestjs/graphql'
import { UserModel } from '$core/users/models/user.model'

@Resolver(() => UserModel)
export class UsersResolver {
  constructor() {}

  @Query(() => [UserModel], { name: 'users', nullable: true })
  async getUsers() {
    return []
  }
}
