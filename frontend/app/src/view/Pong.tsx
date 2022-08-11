import { useRef, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import { Stack, Typography, Divider } from '@mui/material'

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type PongUserProps = {
  nickname: string
  avatar: string
  rating: number
}

export type PongState = {
  leftPaddle: Rect
  rightPaddle: Rect
  ball: Rect
  leftScore: number
  rightScore: number
}

export type PongProps = PongState & {
  leftUser: PongUserProps
  rightUser: PongUserProps
}

const drawRect = (ctx: CanvasRenderingContext2D, rect: Rect) => {
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

const Pong = (props: PongProps) => {
  const pongCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (pongCanvas.current === null) {
      return
    }
    const ctx = pongCanvas.current.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, 600, 600)
    drawRect(ctx, props.leftPaddle)
    drawRect(ctx, props.rightPaddle)
    drawRect(ctx, props.ball)
  })

  return (
    <Stack direction="row">
      <PongUser {...props.leftUser} />
      <Stack>
        <Typography>SCORE</Typography>
        <Stack direction="row" divider={<Divider orientation="vertical" />}>
          <Typography>{props.rightScore}</Typography>
          <Typography>{props.leftScore}</Typography>
        </Stack>
        <canvas width="600" height="600" ref={pongCanvas} />
      </Stack>
      <PongUser {...props.rightUser} />
    </Stack>
  )
}

export default Pong
