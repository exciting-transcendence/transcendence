import { selector } from 'recoil'

export const accessToken = selector({
  key: 'AccessToken',
  get: () => {
    const token = window.localStorage.getItem('access_token')
    if (token === null) {
      return ''
    }
    return token
  },
  set: (_, value) => {
    window.localStorage.setItem('access_token', value as string)
  },
})

export const authFetchOption = selector({
  key: 'AuthFetchOption',
  get: ({ get }) => {
    const token = get(accessToken)
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  },
})
