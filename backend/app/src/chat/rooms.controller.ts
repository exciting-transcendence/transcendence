import { Controller, Get, Post, Body } from '@nestjs/common'
import { ChatroomDto, ChatroomStatusDto } from './chat.dto'
import { ChatService } from './chat.service'
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'

@Controller('/api/chat')
@ApiTags('채팅 API')
export class RoomsController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/list')
  @ApiOkResponse({ type: ChatroomStatusDto, isArray: true })
  getChatroomList() {
    return this.chatService.getAllChatrooms()
  }

  @Post('/create')
  @ApiCreatedResponse({
    description: '새로운 채팅방 생성',
    type: ChatroomStatusDto,
  })
  createChatroom(@Body() roomdto: ChatroomDto) {
    return this.chatService.createChatroom(roomdto)
  }
}
