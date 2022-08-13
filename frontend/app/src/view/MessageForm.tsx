import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Input } from '@mui/material'
import { Socket } from 'socket.io-client'

export const SOCKET_EVENT = {
  JOIN_ROOM: 'JOIN',
  SEND_MESSAGE: 'SEND',
  RECEIVE_MESSAGE: 'RECEIVE',
  NOICE: 'NOTICE',
  CREATE: 'CREATE',
}

type Message = {
  senderUid: number
  msgContent: string
  roomId: string
}

export function MessageForm(prop: { nickname: string; socket: Socket }) {
  const input = useRef<HTMLInputElement>()
  const [typingMessage, setTypingMessage] = useState('')

  const handleChangeTypingMessage = useCallback((event: any) => {
    setTypingMessage(event.target.value)
  }, [])

  const handleSendMesssage = useCallback(() => {
    const noContent = typingMessage.trim() === ''
    if (noContent) {
      return
    }
    prop.socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
      msgContent: typingMessage,
      roomId: '4',
    })
    // state값은 공백으로 변경해줍니다.
    setTypingMessage('')
  }, [prop.socket, prop.nickname, typingMessage])

  const createRoom = () => {
    const roomName = input.current?.value
    console.log(roomName)
    prop.socket.emit(SOCKET_EVENT.CREATE, roomName)
  }

  return (
    <form className="card">
      <div className="d-flex align-items-center">
        <textarea
          className="form-control"
          maxLength={400}
          autoFocus
          value={typingMessage}
          onChange={handleChangeTypingMessage}
        />
        <button
          type="button"
          className="btn btn-primary send-btn"
          onClick={handleSendMesssage}
        >
          전송
        </button>
        <Input inputRef={input}></Input>
        <button
          type="button"
          className="btn btn-primary send-btn"
          onClick={createRoom}
        >
          방만들기
        </button>
      </div>
    </form>
  )
}

export const MessageItem = (prop: { message: Message }) => {
  const { senderUid, msgContent, roomId } = prop.message

  return (
    <div style={{ display: 'flex' }}>
      {senderUid && <div className="message-nickname">{senderUid}: </div>}
      <div>{msgContent}</div>
      <div className="time">{roomId}</div>
    </div>
  )
}

export const MessageList = (prop: { socket: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    { senderUid: 4, msgContent: '테스트 닉네임', roomId: '01:05' },
  ])

  return (
    <div className="chat-window card">
      {messages.map((message, index) => {
        return <MessageItem key={index} message={message} />
      })}
    </div>
  )
}
