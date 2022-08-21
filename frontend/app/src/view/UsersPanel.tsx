import React, { useState } from 'react'
import { Grid, List, Divider, Input, Typography } from '@mui/material'
import {
  MyProfile,
  OtherProfile,
  ProfileListItem,
  VerticalDivider,
} from 'components'
import { User } from 'data'
import { findUser } from 'utility'

export interface Props {
  /** refUser를 제외한 모든 사용자 */
  users: User[]
  /** 친구 목록 */
  friends: User[]
  /** 로그인한 사용자 */
  refUser: User
}
export const UsersPanel = ({ users, friends, refUser }: Props) => {
  const [id, setId] = useState(refUser.uid)
  const [text, setText] = useState('')
  const seenUsers = text ? findUser(users, text) : friends
  const listname = text ? '검색 결과' : '친구 목록'

  const isRefUser = id === refUser.uid
  const currentUser = users.find((user) => user.uid === id) as User

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={4} padding="1rem">
        <Typography variant="h5" padding="1rem">
          My Profile
        </Typography>
        <ProfileListItem user={refUser} onClick={() => setId(refUser.uid)} />
        <Divider />
        <Typography variant="h5" padding="1rem">
          {listname}
        </Typography>
        <Input
          placeholder="아이디로 친구 추가하기"
          onChange={(e) => setText(e.target.value)}
          value={text}
          autoFocus
          color="success"
          style={{ width: '50%' }}
        />
        <List>
          {seenUsers.map((u) => (
            <ProfileListItem
              key={u.uid}
              user={u}
              onClick={() => setId(u.uid)}
            />
          ))}
        </List>
      </Grid>
      <VerticalDivider />
      <Grid item xs={8} padding="100px">
        {isRefUser ? (
          <MyProfile user={refUser} />
        ) : (
          <OtherProfile user={currentUser} refUser={refUser} />
        )}
      </Grid>
    </Grid>
  )
}
