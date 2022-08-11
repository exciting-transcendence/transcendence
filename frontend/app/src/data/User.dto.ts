type gameID = number
type userID = string

export type UserStatusType = 'ONLINE' | 'OFFLINE' | gameID

export interface Stat {
  wins: number
  loses: number
  draws: number
  rating: number
}

// export interface User {
//   uid: number
//   nickname: string
//   avatar: string
//   isActive: boolean
// }

export interface User {
  id: userID
  name: string
  avatar: string
  status: UserStatusType
  friends: userID[]
  blocks: userID[]
  stat: Stat
}
