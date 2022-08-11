import { Injectable } from '@nestjs/common'
import { ChatRoomStatusDto } from './chat.dto'

@Injectable()
export class ChatService {
  private maxRoomId = 0
  private channels: ChatRoomStatusDto[] = []

  getAllChatrooms() {
    return this.channels
  }

  createChatroom(creator: number, roomTitle: string) {
    this.maxRoomId++
    const item: ChatRoomStatusDto = {
      roomId: this.maxRoomId.toString(),
      roomName: roomTitle,
      ownerUid: creator,
      adminUid: [creator],
      joinedUsers: [],
    }
    this.channels.push(item)
    return item
  }
}
