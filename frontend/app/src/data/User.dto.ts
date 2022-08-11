type gameID = string
type userID = number

export type UserStatusType = 'ONLINE' | 'OFFLINE' | gameID

export interface Stat {
  win: number
  lose: number
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
