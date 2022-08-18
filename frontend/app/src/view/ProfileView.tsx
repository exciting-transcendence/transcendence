import { Profile } from 'components/profile/Profile'
import { User } from 'data'
import { useQuery } from '@tanstack/react-query'
import { getMeUser } from 'query'
import { AxiosError } from 'axios'

export const ProfileView = () => {
  const { data, isSuccess } = useQuery<User, AxiosError>(['meUser'], getMeUser)

  if (isSuccess) {
    return <Profile user={data} />
  } else {
    return <div>Loading...</div>
  }
}
