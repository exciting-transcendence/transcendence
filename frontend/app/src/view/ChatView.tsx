import axios from 'axios'
import { useState, useEffect } from 'react'
import { ChatRoomList } from './ChatRoomList'
import { JoinedRoomList } from './JoinedRoomList'
import { Grid, Divider, Typography, Button } from '@mui/material'
import { BasicModal } from './CreateRoomModal'
import { JoinedRoom, Room, Message, ChatSocket } from 'data'
import { ChatPanel } from './ChatPanel'
import { getAuthHeader } from 'hook/getAuthHeader'
import { queryClient, useApiQuery } from 'hook'
import { useMutation } from '@tanstack/react-query'

type Messages = {
  [roomId: number]: Message[]
}

export const ChatView = ({ socket }: { socket: ChatSocket }) => {
  const [chatRoomList, setChatRoomList] = useState<Room[]>([])
  const [modal, setModal] = useState(false)
  const [messages, setMessages] = useState<Messages>({})
  const [showChat, setShowChat] = useState({ bool: false, roomId: 0 })
  const [myUid, setMyUid] = useState<number>()
  const authHeader = getAuthHeader()
  const { data: joinedRoomList, isSuccess } = useApiQuery<JoinedRoom[]>([
    'chat',
    'me',
  ])

  const updateRoom = () => {
    axios.get('/api/chat/joinlist', authHeader).then((res) => {
      console.log(res.data)
      setChatRoomList(res.data)
      setShowChat((showChat) => {
        return { ...showChat, bool: false }
      })
    })
  }
  // res: roomId, roomType, Roomname
  const updateMyRoom = () => {
    queryClient.invalidateQueries(['chat', 'me'])
  }
  useEffect(() => {
    socket.on('NOTICE', (res: Message) => {
      console.log(res, `myUID:${myUid}`)
      if (res.senderUid === myUid) {
        updateMyRoom()
      }
    })
  }, [myUid])
  useEffect(() => {
    axios.get('/api/user/me', authHeader).then((res) => {
      setMyUid(res.data.uid)
    })
    socket.on('RECEIVE', (res: Message) => {
      const id = res.roomId
      const msg = {
        ...res,
        createdAt: new Date(res.createdAt),
      }
      console.log('incoming message')
      console.debug(msg)
      setMessages((messages) => {
        return {
          ...messages,
          [id]: messages[id] ? [...messages[id], msg] : [msg],
        }
      })
    })

    updateMyRoom()
    updateRoom()
  }, [])

  const leaveRoom = (roomId: number) => {
    socket.emit('LEAVE', { uid: roomId })
    // const newJoinedRoom = joinedRoomList.filter((el) => el.id !== roomId)
    // setJoinedRoomList(newJoinedRoom)
    setShowChat((showChat) => {
      return { ...showChat, bool: false }
    })
  }

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item xs={3} padding="1rem">
          <Button fullWidth={true} onClick={() => setModal(true)}>
            방만들기
          </Button>
          <BasicModal setModal={setModal} modal={modal} socket={socket} />
          <Button fullWidth={true} onClick={updateRoom}>
            참여 가능한 방
          </Button>
          <Divider />
          <Typography variant="h6" padding="1rem" textAlign="center">
            참여 중인 채팅 리스트
          </Typography>
          {isSuccess ? (
            <JoinedRoomList setShowChat={setShowChat} room={joinedRoomList} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginRight: '-1px' }}
        />
        <Grid item xs={9} padding="100px">
          {showChat.bool ? (
            <ChatPanel
              chats={messages[showChat.roomId] ? messages[showChat.roomId] : []}
              socket={socket}
              roomId={showChat.roomId}
              leaveRoom={leaveRoom}
            />
          ) : (
            <div>
              <Typography variant="h6" padding="1rem" textAlign="center">
                참여 가능한 채팅 리스트
              </Typography>
              <ChatRoomList
                list={chatRoomList}
                socket={socket}
                setShowChat={setShowChat}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  )
}
