import { User } from 'data/User.dto'

const mockUserGen = (params: Partial<User>): User => {
  return {
    uid: 4,
    nickname: 'Example User',
    status: 'ONLINE',
    friends: [],
    blocks: [],
    stat: {
      win: 2,
      lose: 4,
      rating: 3,
    },
    ...params,
    avatar: `https://picsum.photos/seed/${Math.random()}/200`,
  }
}

export const mockUser = mockUserGen({})
export const mockRefUser = mockUserGen({
  uid: 3,
  nickname: 'This is your profile',
})

export const blockedUser = mockUserGen({
  ...mockUser,
  uid: 1,
  nickname: 'Blocked User',
  status: 'OFFLINE',
  friends: [],
  blocks: [],
})

export const friendUser = mockUserGen({
  ...mockUser,
  uid: 2,
  nickname: 'Friend User',
  status: 'GAME',
  friends: [],
  blocks: [],
})

export const mockUsers = [mockUser, blockedUser, friendUser]
