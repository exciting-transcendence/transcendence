import { useEffect, useState } from 'react'
import { MainRouter, LoginRouter } from 'router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Context />
    </QueryClientProvider>
  )
}

export default App
