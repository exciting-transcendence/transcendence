import React from 'react'
import {
  ButtonGroup,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from '@mui/material'
import { User } from '../data/User.dto'
import { ProfileBase } from './Profile'
import { IconButtonWrap } from './IconButtonWrap'
import {
  Block,
  PersonAdd,
  PersonRemove,
  RadioButtonUnchecked,
} from '@mui/icons-material'

type userStatus = 'DEFAULT' | 'BLOCKED' | 'FRIEND'
const getStatus = (user: User, refUser: User): userStatus => {
  if (refUser.blocks.includes(user.id)) {
    return 'BLOCKED'
  } else if (refUser.friends.includes(user.id)) {
    return 'FRIEND'
  } else {
    return 'DEFAULT'
  }
}

const AddFriendButton = () => (
  <IconButtonWrap
    title="add to friend"
    icon={<PersonAdd />}
    onClick={() => alert('pressed add friend button')}
  />
)

const RemoveFriendButton = () => {
  return (
    <IconButtonWrap
      title="remove from friend"
      icon={<PersonRemove />}
      onClick={() => alert('pressed remove friend button')}
    />
  )
}

const BlockButton = () => {
  return (
    <IconButtonWrap
      title="Block"
      icon={<Block />}
      onClick={() => alert('pressed block button')}
    />
  )
}

const UnblockButton = () => {
  return (
    <IconButtonWrap
      title="Unblock"
      icon={<RadioButtonUnchecked />}
      onClick={() => alert('pressed unblock button')}
    />
  )
}

const Actions = ({ status }: { status: userStatus }) => {
  return (
    <ButtonGroup>
      {status === 'FRIEND' ? <RemoveFriendButton /> : <AddFriendButton />}
      {status === 'BLOCKED' ? <UnblockButton /> : <BlockButton />}
    </ButtonGroup>
  )
}

interface Props {
  user: User
  refUser: User
}
export const OtherProfile = ({ user, refUser }: Props) => {
  const status = getStatus(user, refUser)

  return (
    <Card sx={{ maxWidth: 400 }}>
      <ProfileBase user={user} />
      <Typography align="center">{`status: ${status}`}</Typography>
      <CardActionArea>
        <Grid container justifyContent="right">
          <Actions status={status} />
        </Grid>
      </CardActionArea>
    </Card>
  )
}
