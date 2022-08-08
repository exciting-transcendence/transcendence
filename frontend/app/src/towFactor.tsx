import { QRCodeSVG } from 'qrcode.react'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const Log = styled.div`
  display: grid;
  justify-content: center;
  grid-row-gap: 20px;
  margin: 2rem;
  padding: 2rem;
`
export const GenerateQrcode = () => {
  //   const url = await axios.get('/qr')
  const url = 'https://naver.com'

  return (
    <div style={{ background: 'white', padding: '16px' }}>
      <QRCodeSVG value={url} size={240} />
    </div>
  )
}

export const InputCode = (props: {
  setIsLoggedIn: (value: boolean) => void
}) => {
  const inputText = useRef<HTMLInputElement>(null)
  const [txt, setTxt] = useState('코드를 입력해주세요')
  const handleNameCheck = async (e: any) => {
    // const isCorrect = await axios.get('/2fa')
    const isCorrect = false
    if (isCorrect) {
      props.setIsLoggedIn(true)
    } else {
      setTxt('일치하지 않습니다.')
    }
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '26ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            inputRef={inputText}
            id="standard-basic"
            label={txt}
            variant="standard"
          />
        </div>
      </Box>
      <Button variant="outlined" onClick={handleNameCheck}>
        확인
      </Button>
    </>
  )
}

const QrPage = ({ setIsLoggedIn }: any) => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Log>
          <GenerateQrcode />
          <InputCode setIsLoggedIn={setIsLoggedIn} />
        </Log>
      </ThemeProvider>
    </div>
  )
}
export default QrPage
