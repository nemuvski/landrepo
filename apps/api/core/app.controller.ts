import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common'
import { AuthService } from '$core/auth/auth.service'
import { JwtAuthGuard } from '$core/auth/jwt-auth.guard'
import { LocalAuthGuard } from '$core/auth/local-auth.guard'

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user
  }
}
