import { ApiProperty } from '@nestjs/swagger'

export class ChatroomDto {
  @ApiProperty()
  roomName: string
  // TODO: roomType<public|private|protected>
  // TODO: roomPassword
  @ApiProperty()
  ownerUid: number
}

export class ChatroomStatusDto extends ChatroomDto {
  @ApiProperty()
  roomId: string
  @ApiProperty()
  adminUid: Array<number>
  @ApiProperty()
  joinedUsers: Array<number>
}

export class ChatMessageDto {
  @ApiProperty({ description: '유저id' })
  senderUid: number
  @ApiProperty({ description: '메시지 본문' })
  msgContent: string
  @ApiProperty({ description: '채팅방id' })
  roomId: string
}
