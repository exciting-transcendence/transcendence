import axios from 'axios'
import { User } from 'data'
import { useState, useEffect } from 'react'
import { getAuthHeader } from './getAuthHeader'

const USER_API_KEY = '/api/user'

// TODO: use react-query
export const useUserRequest = <T>(endpoint: string | number) => {
  const [data, setData] = useState<T>()
  const authHeader = getAuthHeader()
  useEffect(() => {
    axios
      .get<T>(`${USER_API_KEY}/${endpoint}`, authHeader)
      .then(async (res) => setData(await res.data))
      .catch((err) => {
        throw err
      })
  }, [])

  return data
}

export const useUser = (uid: number) => {
  return useUserRequest<User>(uid)
}
