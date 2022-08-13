import React, { useRef, useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { Grid, Stack, Typography, Box, Modal } from '@mui/material'
import { withPongProfile } from 'state/pong'
import styled from 'styled-components'

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
  winner: string
  window: {
    ratio: number
    height: number
  }
}

const drawRect = (
  ctx: CanvasRenderingContext2D,
  window: { ratio: number; height: number },
  rect: Rect,
) => {
  ctx.fillRect(
    rect.x * window.height,
    rect.y * window.height,
    rect.width * window.height,
    rect.height * window.height,
  )
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

const ScoreBoard = (props: { leftScore: number; rightScore: number }) => {
  return (
    <>
      <Grid item xs={12} textAlign="center">
        <Typography>SCORE</Typography>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={3} textAlign="center">
        <Typography>{props.rightScore}</Typography>
      </Grid>
      <Grid item xs={2} textAlign="center">
        <Typography>VS</Typography>
      </Grid>
      <Grid item xs={3} textAlign="center">
        <Typography>{props.leftScore}</Typography>
      </Grid>
      <Grid item xs={2} />
    </>
  )
}

const remainTimeModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid black',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

const PongGrid = styled.div`
  display: grid;

  grid-template-columns: 100px 300px 50px 300px 100px;
  grid-template-rows: 50px 50px 600px;

  align-items: center;
  justify-items: center;
`

const PongScore = styled.div`
  grid-column: 2 / 5;
  grid-row: 1 / 2;
`

const PongLeftScore = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`

const PongVs = styled.div`
  grid-column: 3 / 4;
  grid-row: 2 / 3;
`
const PongRightScore = styled.div`
  grid-column: 4 / 5;
  grid-row: 2 / 3;
`

const PongLeftProfile = styled.div`
  grid-column: 1 / 2;
  grid-row: 3 / 4;
`

const PongCanvas = styled.canvas`
  grid-column: 2 / 5;
  grid-row: </PongGrid></PongGrid> 3 / 4;
  border: 1px solid black;
`

const PongRightProfile = styled.div`
  grid-column: 5 / 6;
  grid-row: 3 / 4;
`

const Pong = (props: PongProps) => {
  const pongCanvas = useRef<HTMLCanvasElement>(null)
  const [remainTime, setRemainTime] = useState(3)

  useEffect(() => {
    if (remainTime > 0) {
      const timer = setTimeout(() => {
        setRemainTime((value) => value - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [remainTime])

  useEffect(() => {
    const req = requestAnimationFrame(() => {
      const ctx = (pongCanvas.current as HTMLCanvasElement).getContext(
        '2d',
      ) as CanvasRenderingContext2D
      ctx.clearRect(
        0,
        0,
        props.window.height * props.window.ratio,
        props.window.height,
      )
      drawRect(ctx, props.window, props.leftPaddle)
      drawRect(ctx, props.window, props.rightPaddle)
      drawRect(ctx, props.window, props.ball)
    })
    return () => cancelAnimationFrame(req)
  }, [props])

  console.log(props)

  return (
    <RecoilRoot>
      <PongGrid>
        <Modal open={remainTime > 0}>
          <Box sx={remainTimeModalStyle}>
            <Typography variant="h1">{remainTime}</Typography>
          </Box>
        </Modal>
        <Modal open={!!props.winner}>
          <Box sx={remainTimeModalStyle}>
            <Typography variant="h2">Winner is</Typography>
            {props.winner === 'left' ? (
              <PongUser uid={props.leftUser} />
            ) : (
              <PongUser uid={props.rightUser} />
            )}
          </Box>
        </Modal>
        <PongScore>SCORE</PongScore>
        <PongLeftScore>{props.leftScore}</PongLeftScore>
        <PongVs>VS</PongVs>
        <PongRightScore>{props.rightScore}</PongRightScore>
        <PongLeftProfile>
          <PongUser uid={props.leftUser} />
        </PongLeftProfile>
        <PongCanvas
          width={props.window.ratio * props.window.height}
          height={props.window.height}
          ref={pongCanvas}
        />
        <PongRightProfile>
          <PongUser uid={props.rightUser} />
        </PongRightProfile>
      </PongGrid>
    </RecoilRoot>
  )
}

export default Pong
