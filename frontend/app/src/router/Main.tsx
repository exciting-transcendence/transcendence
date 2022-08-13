import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView } from 'view'
import { Profile } from 'components/profile/Profile'

import { mockUser } from 'mock/mockUser'
import { useEffect, createContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const SOCKET_EVENT = {
  JOIN_ROOM: 'JOIN',
  SEND_MESSAGE: 'SEND',
  RECEIVE_MESSAGE: 'RECEIVE',
  NOICE: 'NOTICE',
  CREATE: 'CREATE',
}

type Data = {
  roomId: number
  senderUid: number
  msgContent: string
}

// interface ServerToClientEvents {
//   noArg: () => void
//   basicEmit: (a: number, b: string, c: Buffer) => void
//   withAck: (d: string, callback: (e: number) => void) => void
// }

// interface ClientToServerEvents {
//   hello: () => void
// }

export const MainRouter = () => {
  console.log('is loaded?')
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => {
    const socket = io('/api/chat', {
      auth: { token: window.localStorage.getItem('access_token') },
    })
    setSocket(socket)
    socket.on('connect', () => {
      console.log('socket server connected.')
    })
    socket.on('disconnect', () => {
      console.log('socket server disconnected.')
    })
    socket.on(SOCKET_EVENT.NOICE, (res: Data) =>
      console.log(`NOTICE EVENT: ${res.msgContent}`),
    )
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, (res) => console.log(res))
    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/game" element={<GameView />} />
        <Route path="/friend" element={<FriendView />} />
        <Route path="/profile" element={<Profile user={mockUser} />} />
        <Route path="/Chat" element={<ChatView socket={socket} />} />
      </Routes>
    </div>
  )
}
