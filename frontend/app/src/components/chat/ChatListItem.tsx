import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from '@mui/material'
import { User } from 'data'
import { AcceptOrDeny, AvatarWithStatus } from 'components'
import { currentMessagesState, useApiQuery, useToggles } from 'hook'
import { useContext } from 'react'
import { ChatSocketContext, PongSocketContext } from 'router'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

interface TextProps {
  primary?: string
}
const ChatText = ({ primary }: TextProps) => {
  const messages = useRecoilValue(currentMessagesState)
  return (
    <ListItemText
      primary={primary || 'Unknown User'}
      secondary={messages.join('\n')}
      secondaryTypographyProps={{ whiteSpace: 'pre-line' }}
    />
  )
}
interface Props {
  user?: User
  messages: string[]
  onClick?: () => void
}
export const ChatListItem = ({ user, messages, onClick }: Props) => {
  if (!user) {
    return (
      <ListItem alignItems="flex-start" button>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ChatText />
      </ListItem>
    )
  }

  const { avatar, uid, nickname, status } = user
  return (
    <ListItem alignItems="flex-start" button onClick={onClick}>
      <ListItemAvatar>
        <AvatarWithStatus status={status} avatar={avatar} />
      </ListItemAvatar>
      <ChatText primary={`${nickname}#${uid}`} />
    </ListItem>
  )
}
interface InviteProps {
  /** 초대한 사용자의 uid */
  matchTarget: number
  /** 받은 사용자의 uid */
  recieverUid: number
  /** 방 id */
  roomId: number
}
export const AcceptGame = ({
  matchTarget,
  recieverUid,
  roomId,
}: InviteProps) => {
  const pongSocket = useContext(PongSocketContext)
  const chatSocket = useContext(ChatSocketContext)
  const navigate = useNavigate()

  const [open, { off }] = useToggles(true)

  if (!open || !pongSocket || !chatSocket) return null

  return (
    <AcceptOrDeny
      onAccept={() => {
        pongSocket.emit('match', {
          isPrivate: true,
          matchTarget,
        })
        navigate('/game')
        off()
      }}
      onDeny={() => {
        chatSocket.emit('SEND', {
          senderUid: recieverUid,
          roomId,
          msgContent: '초대를 거절했습니다.',
          createdAt: new Date(),
        })
        off()
      }}
    />
  )
}
