import React from 'react'

import { User } from 'data'
import { useUserQuery } from 'hook'
import { UsersPanel } from './UsersPanel'

export const FriendView = () => {
  const { data: me, isSuccess: ok1 } = useUserQuery<User>(['user', 'me'])
  const { data: users, isSuccess: ok2 } = useUserQuery<User[]>([
    'user',
    'me',
    'friend',
  ])

  if (ok1 && ok2) {
    const otherUsers = users.filter((u) => u.uid !== me.uid)
    return <UsersPanel users={otherUsers} refUser={me} />
  }
  return <div>Loading...</div>
}
