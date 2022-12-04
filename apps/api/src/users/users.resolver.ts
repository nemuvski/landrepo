import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { FindUniqueUserArgs, User } from '$/nestgraphql'
import { UsersService } from '$/users/users.service'

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args() args: FindUniqueUserArgs) {
    return await this.usersService.findUnique(args)
  }
}
