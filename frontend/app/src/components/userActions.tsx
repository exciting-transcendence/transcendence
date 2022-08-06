import { IconButtonWrap } from './IconButtonWrap'
import {
  Block,
  LocalPostOffice,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material'

export const AddFriendButton = () => (
  <IconButtonWrap
    title="add to friend"
    icon={<PersonAdd />}
    onClick={() => alert('pressed add friend button')}
  />
)

export const RemoveFriendButton = () => {
  return (
    <IconButtonWrap
      title="remove from friend"
      icon={<PersonRemove />}
      onClick={() => alert('pressed remove friend button')}
    />
  )
}

export const BlockButton = () => {
  return (
    <IconButtonWrap
      title="Block"
      icon={<Block />}
      onClick={() => alert('pressed block button')}
    />
  )
}

export const UnblockButton = () => {
  return (
    <IconButtonWrap
      title="Unblock"
      icon={<Block />}
      onClick={() => alert('pressed unblock button')}
    />
  )
}

export const MessageButton = () => {
  return (
    <IconButtonWrap
      title="Send Direct Message"
      icon={<LocalPostOffice />}
      onClick={() => alert('pressed direct message button')}
    />
  )
}
