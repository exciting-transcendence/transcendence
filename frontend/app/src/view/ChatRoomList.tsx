import { Socket } from 'dgram'
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
  Fragment,
  Dispatch,
  SetStateAction,
} from 'react'
import { Box, Paper, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ChatSocket, Room, RoomType } from 'data'
import { PwdModal } from './EnterPwdModal'
import LockIcon from '@mui/icons-material/Lock'
import { ChatViewOption } from './ChatView'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export const ChatRoomList = (prop: {
  list: Room[]
  socket: ChatSocket
  setShowChat: Dispatch<SetStateAction<ChatViewOption>>
}) => {
  const [modal, setModal] = useState(false)
  const joinRoom = (roomId: number, roomType: RoomType) => {
    prop.socket.emit('JOIN', { roomId }, (res) => {
      if (res.status === 200) {
        prop.setShowChat({ bool: true, roomId, roomType })
      }
    })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {prop.list.map((chatRoom: Room) => {
          if (chatRoom.roomtype === 'PROTECTED')
            return (
              <Fragment key={chatRoom.id}>
                <PwdModal
                  setModal={setModal}
                  modal={modal}
                  socket={prop.socket}
                  setShowChat={prop.setShowChat}
                  roomId={chatRoom.id}
                />
                <Item onClick={() => setModal(true)}>
                  <LockIcon />
                  {chatRoom.name}
                </Item>
              </Fragment>
            )
          else
            return (
              <Item
                key={chatRoom.id}
                onClick={() => joinRoom(chatRoom.id, chatRoom.roomtype)}
              >
                {chatRoom.name}
              </Item>
            )
        })}
      </Stack>
    </Box>
  )
}
