import { useEffect, useState } from 'react'
import { MainRouter, LoginRouter } from 'router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

export const Context = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem('access_token')) {
      setIsLoggedIn(true)
    }
  })

  if (isLoggedIn) {
    return <MainRouter />
  } else {
    return <LoginRouter setIsLoggedIn={setIsLoggedIn} />
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        const { data } = await axios.get(`/api/${url}`)
        return data
      },
    },
  },
})

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Context />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
