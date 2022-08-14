import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { ChatRoomStatusDto } from './chat.dto'
import { ChatService } from './chat.service'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { JwtAfterTwoFactorUserGuard } from 'auth/jwt.strategy'

@Controller('/api/chat')
@ApiTags('채팅 API')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @ApiOkResponse({ type: ChatRoomStatusDto, isArray: true })
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }
  @Get('/me')
  @UseGuards(JwtAfterTwoFactorUserGuard)
  @ApiOkResponse({ type: ChatRoomStatusDto, isArray: true })
  getMyChatroomList(@Req() req: any) {
    const { uid } = req.user
    return this.chatService.findRoomsByUserId(uid)
  }
}
