import React from 'react'
import {
  ButtonGroup,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from '@mui/material'
import { User } from 'data/User.dto'
import { ProfileBase } from './Profile'
import {
  AddFriendButton,
  RemoveFriendButton,
  BlockButton,
  UnblockButton,
  MessageButton,
} from './userActions'

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

const Actions = ({ status }: { status: userStatus }) => {
  if (status === 'BLOCKED') {
    return <UnblockButton />
  }

  return (
    <ButtonGroup>
      {status === 'FRIEND' ? <RemoveFriendButton /> : <AddFriendButton />}
      <BlockButton />
      <MessageButton />
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
