import React from 'react'
import fuzzysort from 'fuzzysort'

import { User } from 'data'
import { useUserRequest } from 'hook'
import { UsersPanel } from './UsersPanel'

export const findUser = (users: User[], text: string) => {
  return fuzzysort.go(text, users, { key: 'nickname' }).map((r) => r.obj)
}

export const FriendView = () => {
  const refUser = useUserRequest<User>('me')
  const users = useUserRequest<User[]>('me/friend')

  if (!(refUser && users)) {
    return <div>Loading...</div>
  }

  const otherUsers = users.filter((u) => u.uid !== refUser.uid)
  return <UsersPanel users={otherUsers} refUser={refUser} />
}
