import { getAuthHeader } from './getAuthHeader'
import { useQuery } from '@tanstack/react-query'
import { ChatUser, OtherUser, User } from 'data'
import axios, { AxiosError } from 'axios'
import { MINUTE } from 'utility/time'
import { getDataFn, ApiOptions } from './useApiQuery'
export type UserApiKey = ['user', ...(string | number)[]]

export const useUserQuery = (uid: number) => {
  const { headers } = getAuthHeader()

  return useQuery(['user', uid], async (): Promise<User> => {
    let res = await fetch(`/api/user/${uid}`, { headers })

    if (!res.ok) {
      throw res
    }

    const data = await res.json()

    res = await fetch(data.avatar, { headers })

    if (!res.ok) {
      throw res
    }

    const blob = await res.blob()
    data.avatar = window.URL.createObjectURL(blob)

    return data
  })
}

const mapUserAvatar = async (user: User) => {
  const { headers } = getAuthHeader()
  const { data: blob } = await axios.get<Blob>(user.avatar, {
    headers,
    responseType: 'blob',
  })

  user.avatar = window.URL.createObjectURL(blob)
  return user
}

const getUserFn = (key: UserApiKey) => async () => {
  const user = await getDataFn<User>(key)()
  return mapUserAvatar(user)
}
const getUsersFn = (key: UserApiKey) => async () => {
  const users = await getDataFn<User[]>(key)()
  return Promise.all(users.map(mapUserAvatar))
}
const getChatUsersFn = (key: ['chat', number, 'list']) => async () => {
  const chatUsers = await getDataFn<ChatUser[]>(key)()
  return Promise.all(
    chatUsers.map((chatUser) => {
      mapUserAvatar(chatUser.user as User)
      return chatUser
    }),
  )
}

export const useUserQuery2 = (key: UserApiKey) =>
  useQuery<User, AxiosError>(key, getUserFn(key))

export const useUsersQuery = (key: UserApiKey) =>
  useQuery<User[], AxiosError>(key, getUsersFn(key))

export const useChatUsersQuery = (key: ['chat', number, 'list']) =>
  useQuery<ChatUser[], AxiosError>(key, getChatUsersFn(key))
