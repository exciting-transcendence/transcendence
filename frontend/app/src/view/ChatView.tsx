import { mapArgsToTypes } from '@storybook/store'
import axios from 'axios'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { ChatRoom } from './ChatRoom'
import { ChatList } from './ChatList'
import { MyRoomList } from './MyRoomList'
import { Grid, List, Divider, Input, Typography, Button } from '@mui/material'

export const SOCKET_EVENT = {
  JOIN_ROOM: 'JOIN',
  SEND_MESSAGE: 'SEND',
  RECEIVE_MESSAGE: 'RECEIVE',
  NOICE: 'NOTICE',
  CREATE: 'CREATE',
}

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
  const [roomList, setRoomList] = useState<Room[]>()
  const [myRoomList, setMyRoomList] = useState<myRoom[]>([])
  console.log('Chatview')
  const nickname = 'testing'
  const token = window.localStorage.getItem('access_token')

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
      .get('/api/chat/list', {
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
        <Grid item xs={4} padding="1rem">
          <Button style={{ margin: '0.5rem', width: '243px' }}>방만들기</Button>
          <Button style={{ margin: '0.5rem', width: '243px' }}>
            방참여하기
          </Button>
          <Divider />
          <MyRoomList room={myRoomList} />
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginRight: '-1px' }}
        />
        <Grid item xs={8} padding="100px">
          {roomList ? (
            <div>
              <ChatList list={roomList} />
              <ChatRoom nickname={nickname} socket={prop.socket} />
              <button onClick={updateRoom}>참여 가능한 방 리스트</button>
            </div>
          ) : (
            <div
              className="d-flex flex-column justify-content-center align-items-center vh-100"
              style={{ width: '50%' }}
            >
              <ChatRoom nickname={nickname} socket={prop.socket} />
              <button onClick={updateRoom}>참여 가능한 방 리스트</button>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  )
}
