import { List, ListSubheader } from '@mui/material'
import { ProfileListItem } from 'components'
import { User } from 'data'
import { partition } from 'utility/partition'

interface SectionProps extends Props {
  title: string
}
const Section = ({ title, users }: SectionProps) => (
  <>
    <ListSubheader>{title}</ListSubheader>
    {users.map((user) => ProfileListItem({ user }))}
  </>
)
interface Props {
  users: User[]
}
export const MemberList = ({ users }: Props) => {
  const [onlineUsers, offlineUsers] = partition(
    users,
    (user) => user.status !== 'OFFLINE',
  )
  return (
    <List>
      <Section title={`온라인 - ${onlineUsers.length}`} users={onlineUsers} />
      <Section
        title={`오프라인 - ${offlineUsers.length}`}
        users={offlineUsers}
      />
    </List>
  )
}
