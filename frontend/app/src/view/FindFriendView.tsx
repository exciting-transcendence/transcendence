import { User } from 'data'
import { useUserRequest } from 'hook'
import { UsersPanel } from './UsersPanel'

export const FindFriendView = () => {
  const refUser = useUserRequest<User>('me')
  const users = useUserRequest<User[]>('')

  if (!(refUser && users)) {
    return <div>Loading...</div>
  }

  const otherUsers = users.filter((u) => u.uid !== refUser.uid)
  return <UsersPanel users={otherUsers} refUser={refUser} listname={'Users'} />
}
