import { Message, Messages } from 'data'
import { atom, selector } from 'recoil'

// TODO: atomfamily로 변경
export const messagesState = atom<Messages>({
  key: 'messagesState',
  default: {},
})

// export const currentMessagesState = selector({
//   key: 'currentMessagesState',
//   get: ({ get }) => {
//     const messages = get(messagesState)
//     const chatRoom = get(chatRoomState)

//     return messages[chatRoom.roomId] || []
//   },
// })
