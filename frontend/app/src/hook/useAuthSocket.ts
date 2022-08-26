import { io, Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'

export const useAuthSocket = <T extends Socket>(url: string): [T, boolean] => {
  const token = window.localStorage.getItem('access_token') || ''
  const [socket, _] = useState<Socket>(
    io(url, { auth: { token }, transports: ['websocket'], autoConnect: false }),
  )
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const handleConnect = () => {
      setIsReady(true)
    }

    socket.on('connect', handleConnect)
    socket.connect()

    return () => {
      socket.off('connect', handleConnect)
      socket.disconnect()
      setIsReady(false)
    }
  }, [])

  return [socket as T, isReady]
}
