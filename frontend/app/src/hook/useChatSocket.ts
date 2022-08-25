import { useEffect } from 'react'
import { ChatSocket } from 'data'
import { useAuthSocket } from 'hook'
import {
  queryClient,
  useUserQuery,
  selectedChatState,
  messageRecordState,
} from 'hook'
import { Message } from 'data'
import { useRecoilState, useRecoilValue } from 'recoil'

export const useChatSocket = () => {
  const socket = useAuthSocket<ChatSocket>('/api/chat')
  const [messages, setMessages] = useRecoilState(messageRecordState)
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState)
  const { roomId } = selectedChat

  const { data: me, isSuccess } = useUserQuery(['user', 'me'])
  useEffect(() => {
    if (socket === undefined) {
      return
    }

    socket.on('connect', () => {
      console.log('socket server connected.')
    })
    socket.on('disconnect', () => {
      console.log('socket server disconnected.')
    })

    // return () => {
    //   socket.disconnect()
    // }
  }, [socket])
  useEffect(() => {
    if (socket === undefined) {
      return
    }
    socket.on('STATUS', (res) => {
      console.log('STATUS: ', res)
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['chat'])
    })
    return () => {
      socket.removeAllListeners('CHATUSER_STATUS')
    }
  }, [socket])
  useEffect(() => {
    if (socket === undefined) {
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
  }, [socket])

  useEffect(() => {
    if (!isSuccess || socket === undefined) {
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
  }, [me, socket])

  useEffect(() => {
    if (socket === undefined) {
      return
    }
    socket.on('RECEIVE', (res: Message) => {
      const id = res.roomId
      const msg = {
        ...res,
        createdAt: new Date(res.createdAt),
      }
      console.log('incoming message')
      console.debug(msg)
      setMessages((prev) => {
        return {
          ...prev,
          [id]: prev[id] ? [...prev[id], msg] : [msg],
        }
      })
    })
    return () => {
      socket.removeAllListeners('RECEIVE')
    }
  }, [socket])

  useEffect(() => {
    if (socket === undefined) {
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
  }, [socket])

  return { socket }
}