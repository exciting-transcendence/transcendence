import { useEffect, useState } from 'react'
import { MainRouter, LoginRouter } from 'router'

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

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

export default App
