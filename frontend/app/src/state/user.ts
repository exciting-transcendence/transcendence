import { selector, selectorFamily } from 'recoil'
import { authFetchOption } from './auth'

export const user = selectorFamily({
  key: 'User',
  get:
    (uid: number) =>
    async ({ get }) => {
      const option = get(authFetchOption)

      const res = await fetch(`/api/user/${uid}`, {
        ...option,
        method: 'GET',
      })

      if (res.ok) {
        return await res.json()
      } else {
        throw new Error('Failed to get user')
      }
    },
})

export const me = selector({
  key: 'Me',
  get: async ({ get }) => {
    const option = get(authFetchOption)
    const res = await fetch(`/api/user/me`, {
      ...option,
      method: 'GET',
    })

    if (res.ok) {
      return await res.json()
    } else {
      throw new Error('Failed to get my data')
    }
  },
})
