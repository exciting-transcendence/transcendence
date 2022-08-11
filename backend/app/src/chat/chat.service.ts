import { Injectable } from '@nestjs/common'
import { ChatRoomStatusDto } from './chat.dto'

@Injectable()
export class ChatService {
  private maxRoomId = 0
  private channels: Map<number, ChatRoomStatusDto> = new Map()

  getAllChatrooms() {
    return this.channels
  }

  createChatroom(creator: number, roomTitle: string) {
    this.maxRoomId++
    const item: ChatRoomStatusDto = {
      roomId: this.maxRoomId,
      roomName: roomTitle,
      ownerUid: creator,
      adminUid: [creator],
      joinedUsers: [],
    }
    this.channels[this.maxRoomId] = item
    return item
  }

  addUserToRoom(uid: number, roomId: number) {
    this.channels[roomId].joinedUsers.push(uid)
  }

  addUserAsAdmin(uid: number, roomId: number) {
    this.channels[roomId].adminUid.push(uid)
  }

  removeUserAsAdmin(uid: number, roomId: number) {
    const idx = this.channels[roomId].adminUid.indexOf(uid)
    this.channels[roomId].adminUid.splice(idx, 1)
  }
}
