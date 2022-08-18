import React from 'react'
import fuzzysort from 'fuzzysort'

import { User } from 'data'
import { useUserQuery } from 'hook'
import { UsersPanel } from './UsersPanel'

export const findUser = (users: User[], text: string) => {
  return fuzzysort.go(text, users, { key: 'nickname' }).map((r) => r.obj)
}

export const FriendView = () => {
  const { data: me, isSuccess: ok1 } = useUserQuery<User>('me')
  const { data: users, isSuccess: ok2 } = useUserQuery<User[]>('me/friend')

  if (ok1 && ok2) {
    const otherUsers = users.filter((u) => u.uid !== me.uid)
    return <UsersPanel users={otherUsers} refUser={me} />
  }
  return <div>Loading...</div>
}
