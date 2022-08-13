import { useState, useCallback, useEffect, useRef, useContext } from 'react'

type Room = {
  id: number
  name: string
  roomtype: string
  password: string
  bannedIds: number[]
  mutedIds: number[]
  chatUser: any[]
}

export const ChatList = (prop: { list: Room[] }) => {
  return (
    <>
      {prop.list.map((room) => (
        <div>{room.name}</div>
      ))}
    </>
  )
}
