import { mapArgsToTypes } from '@storybook/store'
import axios from 'axios'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { ChatRoomList } from './ChatRoomList'
import { JoinedRoomList } from './JoinedRoomList'
import { Grid, List, Divider, Input, Typography, Button } from '@mui/material'
import { BasicModal } from './CreateRoomModal'
import { JoinedRoom, Room, Message } from 'data'
import { ChatList } from 'components/chat/ChatList'

const RoomList: Room[] = [
  {
    id: 1,
    name: '방 이름1',
    roomtype: '1',
    password: '123',
    bannedIds: [],
    mutedIds: [],
    chatUser: [],
  },
  {
    id: 1,
    name: '방 이름2',
    roomtype: '1',
    password: '123',
    bannedIds: [],
    mutedIds: [],
    chatUser: [],
  },
  {
    id: 1,
    name: '방 이름3',
    roomtype: '1',
    password: '123',
    bannedIds: [],
    mutedIds: [],
    chatUser: [],
  },
]
const myRoomDummy: JoinedRoom[] = [
  {
    id: 1,
    name: '방 이름1',
    roomtype: '1',
  },
  {
    id: 2,
    name: '방 이름2',
    roomtype: '1',
  },
  {
    id: 3,
    name: '방 이름3',
    roomtype: '1',
  },
]

type messages = {
  [key: number]: { senderUid: number; msgContent: string }[]
}

export const ChatView = (prop: { socket: any }) => {
  const [chatRoomList, setChatRoomList] = useState<Room[]>([])
  const [joinedRoomList, setJoinedRoomList] = useState<JoinedRoom[]>([])
  const token = window.localStorage.getItem('access_token')
  const [modal, setModal] = useState(false)
  const [messages, setMessages] = useState<messages>()
  const [showChat, setShowChat] = useState({ bool: false, roomId: 0 })
  const updateRoom = () => {
    axios
      .get('/api/chat/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setChatRoomList(res.data)
      })
  }

  const updateMyRoom = () => {
    //참여 가능한 룸 리스트
    axios
      .get('/api/chat/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setJoinedRoomList(res.data)
      })
  }
  useEffect(() => {
    prop.socket.on('RECEIVE', (res: Message) => {
      console.log(res)
    })
    prop.socket.on('NOTICE', (res: Message) => {
      console.log(`NOTICE EVENT: ${res.msgContent}`)
      // if (res.senderUid === myuid)
      //   updateMyRoom()
    })
    updateMyRoom()
    updateRoom()
  }, [])
  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item xs={3} padding="1rem">
          <Button fullWidth={true} onClick={() => setModal(true)}>
            방만들기
          </Button>
          <BasicModal setModal={setModal} modal={modal} socket={prop.socket} />
          <Button fullWidth={true} onClick={updateRoom}>
            참여 가능한 방
          </Button>
          <Divider />
          <Typography variant="h6" padding="1rem" textAlign="center">
            참여 중인 채팅 리스트
          </Typography>
          <JoinedRoomList room={joinedRoomList} />
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginRight: '-1px' }}
        />
        <Grid item xs={9} padding="100px">
          {showChat ? (
            <ChatList chats={[]} />
          ) : (
            <div>
              <Typography variant="h6" padding="1rem" textAlign="center">
                참여 가능한 채팅 리스트
              </Typography>
              <ChatRoomList
                list={chatRoomList}
                socket={prop.socket}
                setShowChat={setShowChat}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  )
}
