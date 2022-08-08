import { Controller, Put, UseGuards, Req, Delete, Get } from '@nestjs/common'

import { TwoFactorService } from './two-factor.service'
import { UserService } from 'user/user.service'
import { JwtFtGuard } from './ft/jwt-ft.strategy'
import { JwtUserGuard } from './jwt.strategy'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Put('/2fa')
  @UseGuards(JwtUserGuard)
  async enable(@Req() req: any) {
    const { uid } = req.user

    return {
      qr: await this.twoFactorService.enable(uid),
    }
  }

  @Delete('/2fa')
  @UseGuards(JwtUserGuard)
  async disable(@Req() req: any) {
    const { uid } = req.user

    await this.twoFactorService.disable(uid)
  }

  @Get('/2fa')
  @UseGuards(JwtFtGuard)
  async verify(@Req() req: any) {
    const { uid } = req.user

    return {
      verified: await this.twoFactorService.verify(uid, req.query.token),
    }
  }
}
