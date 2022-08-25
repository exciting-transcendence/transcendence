import { Message, Messages } from 'data'
import { atom, selector } from 'recoil'
import { selectedChatState } from './selectedChatState'

export const messagesState = atom<Messages>({
  key: 'messagesState',
  default: {},
})

export const currentMessagesState = selector({
  key: 'currentMessagesState',
  get: ({ get }) => {
    const messages = get(messagesState)
    const selectedChat = get(selectedChatState)

    return messages[selectedChat.roomId] || []
  },
})
