import { Grid, Button, Tooltip, Typography, Paper, Box } from '@mui/material'
import { Message, ChatSocket, User, ChatUser, RoomType } from 'data'
import { ChatInput, ChatList, MemberList } from 'components'
import {
  useApiQuery,
  useChatUsersQuery,
  useUserQuery,
  queryClient,
  selectedChatState,
} from 'hook'
import { Logout } from '@mui/icons-material'
import { InviteUser } from './InviteUser'
import { MemberView } from './MemberView'
import { PwdSetOption } from './PwdSetModal'
import { useState, useEffect } from 'react'
import { ChatViewOption } from './ChatView'
import { useRecoilValue } from 'recoil'

// TODO: 나가기 누를 때 한 번 더 확인하기
const LeaveButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick}>
      <Tooltip title="나가기">
        <Logout />
      </Tooltip>
    </Button>
  )
}

interface ExtraOptionProps {
  socket: ChatSocket
}

const ExtraOptionPerRoom = ({ socket }: ExtraOptionProps) => {
  const { roomId, roomType } = useRecoilValue(selectedChatState)
  const [isOwner, setIsOwner] = useState(false)
  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: users, isSuccess: usersOk } = useChatUsersQuery(
    ['chat', roomId, 'list'],
    { enabled: meOk },
  )
  if (usersOk && meOk && isOwner === false) {
    users.forEach((el) => {
      if (el.user.uid === me.uid && el.isOwner) setIsOwner(true)
    })
  }
  if ((roomType === 'PUBLIC' || roomType === 'PROTECTED') && isOwner) {
    return <PwdSetOption socket={socket} />
  } else if (roomType === 'PRIVATE') {
    return <InviteUser socket={socket} roomId={roomId} />
  } else return null
}

interface PanelProps {
  chats: Message[]
  socket: ChatSocket
  leaveRoom: (roomId: number) => void
}
export const ChatPanel = ({ chats, socket, leaveRoom }: PanelProps) => {
  const { roomId } = useRecoilValue(selectedChatState)

  const sendMsg = (msg: string) => {
    socket.emit('SEND', {
      roomId,
      msgContent: msg,
      createdAt: new Date(),
    } as Message)
    console.log(`sent msg: ${msg}`)
  }

  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useApiQuery<ChatUser[]>([
    'chat',
    roomId,
    'list',
  ])
  const mydata = chatusers?.find((user) => user.user.uid === me?.uid)
  useEffect(() => {
    if (socket === undefined) {
      return
    }
    socket.on('CHATUSER_STATUS', (res) => {
      console.log(res)
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['chat', roomId, 'list'])
    })
    return () => {
      socket.removeAllListeners('CHATUSER_STATUS')
    }
  }, [socket])
  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={8}>
        <Box style={{ overflow: 'auto' }}>
          <ChatList chats={chats} />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <ExtraOptionPerRoom socket={socket} />
        <MemberView />
      </Grid>
      <ChatInput sendMsg={sendMsg} me={mydata} />
      <LeaveButton onClick={() => leaveRoom(roomId)} />
    </Grid>
  )
}
