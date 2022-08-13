import { MessageList, MessageForm } from './MessageForm'

export const ChatRoom = (props: { nickname: string; socket: any }) => {
  return (
    <div className="text-box">
      <span>{props.nickname}</span> 님 환영합니다!
      <MessageList socket={props.socket} />
      <MessageForm nickname={props.nickname} socket={props.socket} />
    </div>
  )
}
