import { atom } from 'recoil'
import { ChatViewOption } from 'view'

export const useChatViewState = atom<ChatViewOption | undefined>({
  key: 'useChatViewState',
  default: {
    bool: false,
    roomId: 0,
    roomType: 'PUBLIC',
  },
})
