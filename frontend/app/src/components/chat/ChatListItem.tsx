import { ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { User } from 'data'
import { AvatarWithStatus } from 'components'

interface Props {
  user: User
  messages: string[]
  onClick?: () => void
}
export const ChatListItem = ({ user, messages, onClick }: Props) => {
  const { avatar, nickname, status } = user
  return (
    <ListItem alignItems="flex-start" button onClick={onClick}>
      <ListItemAvatar>
        <AvatarWithStatus status={status} avatar={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={nickname}
        secondary={messages.join('\n')}
        secondaryTypographyProps={{ whiteSpace: 'pre-line' }}
      />
    </ListItem>
  )
}
