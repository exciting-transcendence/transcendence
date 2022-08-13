import { useState, useCallback, useEffect, useRef, useContext } from 'react'

type myRoom = {
  id: number
  name: string
  roomtype: string
}
export const MyRoomList = (prop: { room: myRoom[] }) => {
  return (
    <>
      {prop.room.map((r) => (
        <div>{r.name}</div>
      ))}
    </>
  )
}
