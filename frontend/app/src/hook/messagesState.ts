import { Message, MessageRecord } from 'data'
import { atom, selector } from 'recoil'
import { groupBySerial } from 'utility'
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

export const currentGroupedMessagesState = selector({
  key: 'currentGroupedMessagesState',
  get: ({ get }) => {
    const messages = get(currentMessagesState)

    return groupBySerial(messages, (messages) => messages.senderUid)
  },
})
