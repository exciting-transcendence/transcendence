import FriendList from './FriendList'
import React, { useState } from 'react'
import { Grid, List, Container, Divider } from '@mui/material'
import { mockRefUser, mockUsers } from 'mock/mockUser'
import { Profile, OtherProfile, ProfileListItem } from 'components'
import { User } from 'data/User.dto'

const selectUser = (users: User[], refUser: User, id: string) => {
  const currentUser = users.find((user) => user.id === id)
  if (currentUser) {
    return <OtherProfile user={currentUser} refUser={refUser} />
  } else {
    return <Profile user={refUser} />
  }
}

export const FriendView = () => {
  const users = mockUsers // TODO: get users from backend
  const refUser = mockRefUser // TODO: get user from backend

  const [id, setId] = useState(refUser.id)

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={6}>
        <List>
          <ProfileListItem user={refUser} onClick={() => setId(refUser.id)} />
          <Divider />
          {users.map((u) => (
            <ProfileListItem user={u} onClick={() => setId(u.id)} />
          ))}
        </List>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        style={{ marginRight: '-1px' }}
      />
      <Grid item xs={6}>
        {selectUser(users, refUser, id)}
      </Grid>
    </Grid>
  )
  // return (
  //   <>
  //     {id ? (
  //       <FriendProfile>
  //         <Div>
  //           <FriendList clickFriend={clickFriend} />
  //         </Div>
  //         <Div>
  //           {id}
  //           {/* <UserProfile user = {id}/> */}
  //         </Div>
  //       </FriendProfile>
  //     ) : (
  //       <>
  //         <FriendList clickFriend={clickFriend} />
  //       </>
  //     )}
  //   </>
  // )
}
