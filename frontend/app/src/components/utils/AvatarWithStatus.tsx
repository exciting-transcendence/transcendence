import { Avatar } from '@mui/material'
import { User } from 'data'
import { UserStatus } from './UserStatus'

interface Props extends Pick<User, 'status' | 'avatar'> {
  radius?: number
}
export const AvatarWithStatus = ({ status, avatar, radius }: Props) => {
  return (
    <UserStatus
      status={status}
      avatar={
        <Avatar
          src={avatar}
          sx={radius ? { width: radius, height: radius } : null}
        />
      }
      big={radius ? radius > 50 : false}
    />
  )
}
