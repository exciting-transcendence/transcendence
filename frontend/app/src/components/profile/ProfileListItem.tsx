import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { User } from 'data/User.dto'

interface Props {
  user: User
}
export const ProfileListItem = ({ user }: Props) => {
  const { id, avatar, name } = user

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={avatar} />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={id} />
    </ListItem>
  )
}
