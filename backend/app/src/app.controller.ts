import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'
import { UserService } from 'user/user.service'
import { Request } from 'express'

@Controller('/api')
export class AppController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async getProfile(@Req() req: any) {
    const { uid } = req.user
    return await this.userService.findOne(uid)
  }
}
