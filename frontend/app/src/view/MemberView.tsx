import {
  useApiQuery,
  useUserQuery,
  useChatUsersQuery,
  useBanUsersQuery,
} from 'hook'

import { MemberList } from 'components'
import { ChatUser, RoomType, User } from 'data'
import { ChatViewOption } from './ChatView'

interface Props {

}
export const MemberView = ({ selectedChat }: Props) => {
  console.log(`roomId: ${selectedChat.roomId}`)
  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useChatUsersQuery([
    'chat',
    selectedChat.roomId,
    'list',
  ])
  const { data: banusers, isSuccess: banOK } = useBanUsersQuery([
    'chat',
    selectedChat.roomId,
    'ban',
    'list',
  ])

  if (meOk && usersOk && banOK) {
    // const users = chatusers.map(({ user }) => user)
    return (
      <MemberList
        chatusers={chatusers}
        refUser={me}

        banusers={banusers}
      />
    )
  }

  return <div>Loading...</div>
}
