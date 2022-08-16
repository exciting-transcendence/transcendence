import { List } from '@mui/material'
import { Chat } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'
import { groupBySerial } from 'utility/groupBySerial'

interface Props<T extends Chat> {
  chats: T[]
}
export const ChatList = <T extends Chat>({ chats }: Props<T>) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)
  return (
<<<<<<< HEAD
    <>
      <List>
        {groupedChats.map((chats, i) => (
          <ChatListItem
            key={i} // FIXME: createdAt이 구현되면 이걸로 바꾸기
            user={useUser(chats[0].senderUid)} // TODO: cache user
            messages={chats.map((chat) => chat.msgContent)}
          />
        ))}
      </List>
      <button type="submit">전송</button>
    </>
=======
    <List>
      {groupedChats.map((chats) => {
        const first = chats[0]
        const { createdAt, senderUid } = first

        return (
          <ChatListItem
            key={createdAt.toISOString() + first.msgContent}
            // FIXME: useUser 언젠가는 쓰기 (지금은 백엔드 에러로 storybook에서 실행 안됨)
            messages={chats.map((chat) => chat.msgContent)}
          />
        )
      })}
    </List>
>>>>>>> 4e5c0cb767f6c795304d67645f7b73f16975ab0a
  )
}
