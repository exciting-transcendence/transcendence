import React, { useContext } from 'react'
import { ButtonGroup, Grid, Typography } from '@mui/material'
import { User } from 'data'
import { Profile } from './Profile'
import {
  AddFriendButton,
  RemoveFriendButton,
  BlockButton,
  UnblockButton,
  MessageButton,
  JoinGameAsSpectatorButton,
} from './userActions'

import { ChatSocketContext, PongSocketContext } from 'router/Main'
import { useNavigate } from 'react-router-dom'
import { getAuthHeader } from 'hook/getAuthHeader'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import {
  addFriendMutation,
  blockMutation,
  refreshUsers,
  removeFriendMutation,
  unblockMutation,
  useApiQuery,
} from 'hook'
import { strtrim } from 'utility'

type userStatus = 'DEFAULT' | 'BLOCKED' | 'FRIEND'
const getStatus = (user: User, refUser: User): userStatus => {
  if (refUser.blocks.includes(user.uid)) {
    return 'BLOCKED'
  } else if (refUser.friends.includes(user.uid)) {
    return 'FRIEND'
  } else {
    return 'DEFAULT'
  }
}

const Actions = ({
  status,
  selfUid,
  isInGame,
}: {
  status: userStatus
  selfUid: number
  isInGame: boolean
}) => {
  const pongSocket = useContext(PongSocketContext)
  const chatSocket = useContext(ChatSocketContext)
  const me = useApiQuery<User>(['user', 'me'])
  const otherUser = useApiQuery<User>(['user', selfUid])
  const navigate = useNavigate()
  const [block, unblock, addFriend, removeFriend] = [
    blockMutation(),
    unblockMutation(),
    addFriendMutation(),
    removeFriendMutation(),
  ]

  if (status === 'BLOCKED') {
    return <UnblockButton onClick={() => unblock.mutate(selfUid)} />
  }
  return (
    <ButtonGroup>
      {status === 'FRIEND' ? (
        <RemoveFriendButton onClick={() => removeFriend.mutate(selfUid)} />
      ) : (
        <AddFriendButton onClick={() => addFriend.mutate(selfUid)} />
      )}
      <BlockButton onClick={() => block.mutate(selfUid)} />
      {chatSocket && otherUser && me ? (
        <MessageButton
          onClick={() => {
            const title = strtrim(`DM${me}${otherUser}`)
            chatSocket.emit('CREATE', { title, type: 'DM' }, (res) => {
              if (res.status !== 200) {
                alert('Error creating chat')
              } else {
                navigate('/chat')
              }
            })
          }}
        />
      ) : null}
      {isInGame ? (
        <JoinGameAsSpectatorButton
          onClick={() => {
            if (pongSocket !== undefined) {
              pongSocket.emit('spectator', {
                uid: selfUid,
              })
              navigate('/game')
            }
          }}
        />
      ) : null}
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
    <>
      <Profile user={user} />
      <Typography align="center">{`status: ${status}`}</Typography>
      <Grid container justifyContent="right">
        <Actions
          status={status}
          isInGame={user.status === 'GAME'}
          selfUid={user.uid}
        />
      </Grid>
    </>
  )
}
