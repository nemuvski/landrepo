import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { UsersService } from '$/users/users.service'
import { CreateOneUserArgs } from '$generated/user/create-one-user.args'
import { FindUniqueUserArgs } from '$generated/user/find-unique-user.args'
import { User } from '$generated/user/user.model'

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args() args: FindUniqueUserArgs) {
    return await this.usersService.findUnique(args)
  }

  @Mutation(() => User)
  async createUser(@Args() args: CreateOneUserArgs) {
    return await this.usersService.create(args)
  }
}
