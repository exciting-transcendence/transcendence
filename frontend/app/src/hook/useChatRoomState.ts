import { atom } from 'recoil'
import { ChatViewOption } from 'view'

export const chatRoomState = atom<ChatViewOption>({
  key: 'useChatViewState',
  default: {
    bool: false,
    roomId: 0,
    roomType: 'PUBLIC',
  },
})
