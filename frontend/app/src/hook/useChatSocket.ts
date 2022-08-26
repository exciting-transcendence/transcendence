import { useEffect } from 'react'
import { ChatSocket } from 'data'
import { useAuthSocket } from 'hook'
import {
  queryClient,
  useUserQuery,
  onlineUsersState,
  selectedChatState,
  messageRecordState,
} from 'hook'
import { Message } from 'data'
import { useRecoilState, useRecoilValue } from 'recoil'

export const useChatSocket = () => {
  const [socket, isSocketReady] = useAuthSocket<ChatSocket>('/api/chat')
  const [messages, setMessages] = useRecoilState(messageRecordState)
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState)
  const [onlineUsers, setOnlineUsers] = useRecoilState(onlineUsersState)
  const { roomId } = selectedChat

  const { data: me, isSuccess } = useUserQuery(['user', 'me'])

  useEffect(() => {
    if (!isSocketReady) {
      return
    }
    socket.on('STATUS', ({ uid, status }) => {
      setOnlineUsers((prev) => ({ ...prev, [uid]: status }))
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['chat'])
    })
    return () => {
      socket.removeAllListeners('CHATUSER_STATUS')
    }
  }, [isSocketReady])

  useEffect(() => {
    if (!isSocketReady) {
      return
    }
    socket.on('CHATUSER_STATUS', (res) => {
      console.log('CHATUSER_STATUS: ', res)
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['chat'])
    })
    return () => {
      socket.removeAllListeners('CHATUSER_STATUS')
    }
  }, [isSocketReady])

  useEffect(() => {
    if (!isSuccess || !isSocketReady) {
      return
    }
    const { uid } = me
    socket.on('NOTICE', (res: Message) => {
      console.log(res)
      if (res.senderUid === uid) {
        queryClient.invalidateQueries(['chat', 'me'])
        if (res.msgContent === 'banned')
          setSelectedChat((selectedChat) => ({ ...selectedChat, bool: false }))
      }
      queryClient.invalidateQueries(['chat'])
    })
    return () => {
      socket.removeAllListeners('NOTICE')
    }
  }, [me, isSuccess, isSocketReady])

  useEffect(() => {
    if (!isSocketReady) {
      return
    }
    socket.on('RECEIVE', (res: Message) => {
      const id = res.roomId
      const msg = {
        ...res,
        createdAt: new Date(res.createdAt),
      }
      setMessages((prev) => ({
        ...prev,
        [id]: prev[id] ? [...prev[id], msg] : [msg],
      }))
    })
    return () => {
      socket.removeAllListeners('RECEIVE')
    }
  }, [isSocketReady])

  useEffect(() => {
    if (!isSocketReady) {
      return
    }
    socket.on('DESTROYED', () => {
      queryClient.invalidateQueries(['chat', 'me'])
      queryClient.invalidateQueries(['chat', 'joinlist'])
      setSelectedChat((prev) => ({ ...prev, bool: false }))
    })
    return () => {
      socket.removeAllListeners('DESTROYED')
    }
  }, [isSocketReady])

  return { socket }
}
