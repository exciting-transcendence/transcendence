import { List } from '@mui/material'
import { Chat } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'
import { groupBySerial } from 'utility/groupBySerial'
import { io, Socket } from 'socket.io-client'
import { useState } from 'react'

interface Props<T extends Chat> {
  chats: T[]
  socket: Socket
  id: number
}

export const ChatList = <T extends Chat>({ chats, socket, id }: Props<T>) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)
  const sendmsg = () => {
    socket.emit('SEND', {
      roomId: { id },
      msgContent: 'what do you say?',
      createdAt: new Date(),
    })
  }
  return (
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
      <button onClick={sendmsg}>전송</button>
    </>
  )
}
