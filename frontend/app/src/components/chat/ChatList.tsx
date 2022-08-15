import { List } from '@mui/material'
import { Chat } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'

interface Props {
  chats: Chat[]
}
export const ChatList = ({ chats }: Props) => {
  return (
    <List>
      {chats.map((chat, i) => (
        <ChatListItem
          key={i}
          user={useUser(chat.senderUid)} // TODO: cache user
          messages={[chat.msgContent]}
        />
      ))}
    </List>
  )
}
