import { List } from '@mui/material'
import { Chat, User } from 'data'
import { ChatListItem } from './ChatListItem'
import { groupBySerial } from 'utility/groupBySerial'
import { useUserQuery } from 'hook'

interface Props<T extends Chat> {
  chats: T[]
}

export const ChatList = <T extends Chat>({ chats }: Props<T>) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)

  return (
    <>
      <List>
        {groupedChats.map((chats) => {
          const first: Chat = chats[0]
          const { createdAt, senderUid: uid } = first
          const { data, isSuccess } = useUserQuery<User>(uid)
          return (
            <ChatListItem
              user={isSuccess ? data : undefined}
              key={createdAt.toISOString() + first.msgContent}
              messages={chats.map((chat) => chat.msgContent)}
            />
          )
        })}
      </List>
    </>
  )
}
