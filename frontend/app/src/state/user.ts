import axios from 'axios'
import { User } from 'data'
import { selector, selectorFamily } from 'recoil'
import { withAuthFetchOption } from './auth'

export const withUserRequest = selectorFamily({
  key: 'WithUserRequest',
  get:
    <T>(endpoint: string | number) =>
    async ({ get }) => {
      const option = get(withAuthFetchOption)

      try {
        const { data } = await axios.get<T>(`/api/user/${endpoint}`, option)
        return data
      } catch (e) {
        throw new Error(
          `failed to fetch user endpoint ${endpoint}: reason: ${e}`,
        )
      }
    },
})

export const withUser = selectorFamily({
  key: 'WithUser',
  get:
    (uid: number) =>
    async ({ get }) =>
      get(withUserRequest<User>(uid)),
})

export const withMe = selector({
  key: 'WithMe',
  get: async ({ get }) => get(withUserRequest<User>('me')),
})

export const withUsers = selector({
  key: 'WithUsers',
  get: async ({ get }) => get(withUserRequest<User[]>('')),
})

export const withOtherUsers = selector({
  key: 'WithOtherUsers',
  get: async ({ get }) => {
    const me = get(withMe)
    return get(withUsers).filter((u) => u.uid !== me.uid)
  },
})
