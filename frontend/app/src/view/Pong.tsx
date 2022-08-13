import { useRef, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import { Stack, Typography, Divider } from '@mui/material'
import { withPongProfile } from 'state/pong'
import { useRecoilValue } from 'recoil'

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type PongProps = {
  leftPaddle: Rect
  rightPaddle: Rect
  ball: Rect
  leftScore: number
  rightScore: number
  leftUser: number
  rightUser: number
}

const drawRect = (ctx: CanvasRenderingContext2D, rect: Rect) => {
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
}

const PongUser = (props: { uid: number }) => {
  const profile = useRecoilValue(withPongProfile(props.uid))

  return (
    <Stack>
      <Typography>{profile.nickname}</Typography>
      <Avatar src={profile.avatar} />
      <Typography>{profile.rating}</Typography>
    </Stack>
  )
}

const Pong = (props: PongProps) => {
  const pongCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = (pongCanvas.current as HTMLCanvasElement).getContext(
      '2d',
    ) as CanvasRenderingContext2D
    ctx.clearRect(0, 0, 600, 600)
    drawRect(ctx, props.leftPaddle)
    drawRect(ctx, props.rightPaddle)
    drawRect(ctx, props.ball)
  })

  return (
    <Stack direction="row">
      <PongUser uid={props.leftUser} />
      <Stack>
        <Typography>SCORE</Typography>
        <Stack direction="row" divider={<Divider orientation="vertical" />}>
          <Typography>{props.rightScore}</Typography>
          <Typography>{props.leftScore}</Typography>
        </Stack>
        <canvas
          width="600"
          height="600"
          ref={pongCanvas}
          style={{ border: '1px solid black' }}
        />
      </Stack>
      <PongUser uid={props.rightUser} />
    </Stack>
  )
}

export default Pong
