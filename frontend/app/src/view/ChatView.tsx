import React, { useState, useEffect, FormEvent } from 'react'
import io, { Socket } from 'socket.io-client'

interface ChatMessageDto {
  senderUid: number
  msgContent: string
  roomId: string
}

const socket = io('http://localhost:3000/api/chat')

interface FormProps {
  socket: Socket
}
const MessageForm = ({ socket }: FormProps) => {
  const [text, setText] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(`sent ${text}`)
    socket.emit('message', { text })
    setText('')
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button disabled={!text}>Send</button>
    </form>
  )
}
interface MessageListProps {
  messages: ChatMessageDto[]
}
const MessageList = ({ messages }: MessageListProps) => {
  return (
    <ul>
      {messages.map((e, i) => (
        <li key={i}>{e.msgContent}</li>
      ))}
    </ul>
  )
}

export const ChatView = () => {
  const [messages, setMessages] = useState<ChatMessageDto[]>([])

  socket.on('message', (message: ChatMessageDto) => {
    console.log(`Message received: ${message.msgContent}@${message.senderUid}`)
    setMessages([...messages, message])
  })

  return (
    <div>
      <MessageList messages={messages} />
      <MessageForm socket={socket} />
    </div>
  )
}

export default ChatView
