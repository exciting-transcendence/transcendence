import { Message, MessageRecord } from 'data'
import { atom, selector } from 'recoil'
import { selectedChatState } from './selectedChatState'

export const messageRecordState = atom<MessageRecord>({
  key: 'messageRecord',
  default: {},
})

export const currentMessagesState = selector({
  key: 'currentMessagesState',
  get: ({ get }) => {
    const messageRecord = get(messageRecordState)
    const selectedChat = get(selectedChatState)

    return messageRecord[selectedChat.roomId] ?? []
  },
})
