import { List } from '@mui/material'
import { Message } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'

interface Props {
  chats: Message[]
}
export const ChatList = ({ chats }: Props) => {
  return (
    <List>
      {chats.map((chat, i) => (
        <ChatListItem
          key={i}
          user={useUser(chat.senderUid)}
          messages={[chat.msgContent]}
        />
      ))}
    </List>
  )
}
