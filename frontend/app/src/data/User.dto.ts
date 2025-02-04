type userID = number

export type UserStatusType = 'ONLINE' | 'OFFLINE' | 'GAME' | 'UNKNOWN'

export interface Stat {
  wins: number
  loses: number
  rating: number
}

export interface User {
  uid: userID
  nickname: string
  avatar: string
  status: UserStatusType
  friends: userID[]
  blocks: userID[]
  stat: Stat
}
export type OtherUser = Omit<User, 'friends' | 'blocks'>

export interface ChatUser {
  id: number
  isAdmin: boolean
  isOwner: boolean
  isMuted: boolean
  user: OtherUser
}

export interface BanUser {
  id: number
  user: OtherUser
}
