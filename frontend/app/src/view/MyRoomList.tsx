import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

type myRoom = {
  id: number
  name: string
  roomtype: string
}

export const MyRoomList = (prop: { room: myRoom[] }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {prop.room.map((r: myRoom) => (
          <Item>{r.name}</Item>
        ))}
      </Stack>
    </Box>
  )
}
