import { mapArgsToTypes } from '@storybook/store'
import axios from 'axios'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { ChatList } from './ChatList'
import { MyRoomList } from './MyRoomList'
import { Grid, List, Divider, Input, Typography, Button } from '@mui/material'
import BasicModal from './CreateRoomModal'

export const SOCKET_EVENT = {
  JOIN_ROOM: 'JOIN',
  SEND_MESSAGE: 'SEND',
  RECEIVE_MESSAGE: 'RECEIVE',
  NOICE: 'NOTICE',
  CREATE: 'CREATE',
}

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
const myRoomDummy: myRoom[] = [
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

type Room = {
  id: number
  name: string
  roomtype: string
  password: string
  bannedIds: number[]
  mutedIds: number[]
  chatUser: any[]
}

type myRoom = {
  id: number
  name: string
  roomtype: string
}

export const makeMessage = (pongData: any) => {
  const { senderUid, msgContent, type, roomId } = pongData

  let nicknameLabel
  let contentLabel = ''

  switch (type) {
    case SOCKET_EVENT.JOIN_ROOM: {
      contentLabel = `${senderUid} has joined the room.`
      break
    }
    case SOCKET_EVENT.SEND_MESSAGE: {
      contentLabel = String(msgContent)
      nicknameLabel = senderUid
      break
    }
    default:
  }

  return {
    senderUid: 2,
    msgContent: contentLabel,
    roomId: '03:25',
  }
}

export const ChatView = (prop: { socket: any }) => {
  const [roomList, setRoomList] = useState<Room[]>([])
  const [myRoomList, setMyRoomList] = useState<myRoom[]>([])
  console.log('Chatview')
  const nickname = 'testing'
  const token = window.localStorage.getItem('access_token')
  const [modal, setModal] = useState(false)
  const updateRoom = () => {
    axios
      .get('/api/chat/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setRoomList(res.data)
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
        setMyRoomList(res.data)
      })
  }
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
          <MyRoomList room={myRoomDummy} />
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginRight: '-1px' }}
        />
        <Grid item xs={9} padding="100px">
          <div>
            <Typography variant="h6" padding="1rem" textAlign="center">
              참여 가능한 채팅 리스트
            </Typography>
            <ChatList list={RoomList} socket={prop.socket} />
          </div>
        </Grid>
      </Grid>
    </>
  )
}
