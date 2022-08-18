import axios, { AxiosError } from 'axios'
import { User } from 'data'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getAuthHeader } from 'hook/getAuthHeader'

const USER_API_KEY = '/api/user'

export const getMeUser = async () => {
  const authHeader = getAuthHeader()
  const { data } = await axios.get<User>(`${USER_API_KEY}/me`, authHeader)
  return data
}

export const getAllUsers = async () => {
  const authHeader = getAuthHeader()
  const { data } = await axios.get<User[]>(`${USER_API_KEY}/`, authHeader)
  return data
}
