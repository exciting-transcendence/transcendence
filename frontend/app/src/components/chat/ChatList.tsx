import { List } from '@mui/material'
import { Chat } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'
import { groupBySerial } from 'utility/groupBySerial'

interface Props {
  chats: Chat[]
}
export const ChatList = ({ chats }: Props) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)
  return (
    <List>
      {groupedChats.map((chats, i) => (
        <ChatListItem
          key={i}
          user={useUser(chats[0].senderUid)} // TODO: cache user
          messages={chats.map((chat) => chat.msgContent)}
        />
      ))}
    </List>
  )
}
