import {
  Controller,
  Put,
  UseGuards,
  Req,
  Delete,
  Get,
  Query,
  UnauthorizedException,
  Param,
} from '@nestjs/common'

import { TwoFactorService } from './two-factor.service'
import { UserService } from 'user/user.service'
import {
  JwtAfterTwoFactorUserGuard,
  JwtBeforeTwoFactorUserGuard,
} from './jwt.strategy'
import { VerifyTokenDto } from 'dto/verifyToken.dto'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Put('/2fa')
  @UseGuards(JwtBeforeTwoFactorUserGuard)
  async enable(@Req() req: any) {
    const { uid } = req.user

    return {
      qr: await this.twoFactorService.enable(uid),
    }
  }

  @Delete('/2fa')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  async disable(@Req() req: any) {
    const { uid } = req.user

    await this.twoFactorService.disable(uid)
  }

  @Get('/2fa')
  @UseGuards(JwtBeforeTwoFactorUserGuard)
  async verify(@Req() req: any, @Query() query: VerifyTokenDto) {
    const { uid } = req.user

    const verified = await this.twoFactorService.verify(uid, query.token)

    if (verified) {
      const user = await this.userService.findOneByUid(uid)

      return {
        access_token: this.userService.issueToken(user, true),
      }
    } else {
      throw new UnauthorizedException()
    }
  }

  @Get(':uid')
  async test(@Param('uid') uid: number) {
    const user = await this.userService.findOneByUid(uid)

    return {
      access_token: this.userService.issueToken(user, true),
    }
  }
}
