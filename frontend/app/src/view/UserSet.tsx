import React, { useState, useRef, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
//css
import styled from 'styled-components'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const Img = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
`

const Log = styled.div`
  display: grid;
  justify-content: center;
  grid-row-gap: 20px;
  margin: 2rem;
  padding: 2rem;
`

const UserSet = ({ handleClick }: any) => {
  const imgInput = useRef<HTMLInputElement>(null)
  const inputText = useRef<HTMLInputElement>(null)
  // 사용 가능, 사용 불가능 메시지 표시를 위한 부분
  const [nameCheck, setNameCheck] = useState({
    checked: false,
    txt: '사용할 닉네임을 입력해주세요',
  })
  // 이하 세가지 백엔드로 넘겨줄 정보
  const [typedName, setTypedName] = useState('')
  const [files, setFiles] = useState({
    imgUrl:
      'https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/12/2.jpg?resize=500%2C500&ssl=1',
    files: '',
  })
  const [authset, setAuthset] = useState(false)

  const handleAuthSet = (value: string) => {
    if (value === '설정') setAuthset(true)
    else setAuthset(false)
  }
  // 올린 이미지 미리보기 구현
  const onLoadFile = (e: any) => {
    const file = e.target.files
    const imgTarget = file[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imgTarget)
    fileReader.onload = (e: any) => {
      setFiles({ imgUrl: e.target.result, files: file })
    }
  }
  // 설정 완료 버튼을 눌렀을 경우 백엔드로 전송
  const handleSetClick = (e: any) => {
    if (files.files) {
      const formdata = new FormData()
      formdata.append('uploadImg', files.files[0])
      // axios.post('img', formdata);
      //닉네임, authset 모두 넘겨줌
    }
    handleClick()
  }

  const handleNameCheck = async (e: any) => {
    if (0 && inputText.current) {
      setTypedName(inputText.current.value)
      setNameCheck({ checked: true, txt: '사용 가능합니다' })
    }
    if (1) {
      setNameCheck({ checked: false, txt: '이미 사용중인 닉네임입니다' })
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Log>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              inputRef={inputText}
              id="standard-basic"
              label={nameCheck.txt}
              variant="standard"
            />
          </div>
        </Box>
        <Button variant="outlined" onClick={handleNameCheck}>
          중복 확인
        </Button>
        <div style={{ textAlign: 'center' }}>
          <Img src={files.imgUrl} />
        </div>

        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            2차 인증 설정
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="설정"
              control={<Radio />}
              label="설정"
              onChange={() => handleAuthSet('설정')}
            />
            <FormControlLabel
              value="설정안함"
              control={<Radio />}
              label="설정안함"
              onChange={() => handleAuthSet('설정안함')}
            />
          </RadioGroup>
        </FormControl>
        <Button variant="outlined" onClick={handleSetClick}>
          설정 완료
        </Button>
      </Log>
    </ThemeProvider>
  )
}
export default UserSet

function TwoFactorButton(props: {
  value: string
  setValue: (value: boolean) => void
}) {
  return (
    <RadioGroup
      row
      aria-labelledby="enable-2fa-radio-buttons-group"
      name="enable-2fa-radio-buttons-group"
      value={props.value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const enableTwoFactor = e.target.value === 'enable'
        props.setValue(enableTwoFactor)
      }}
    >
      <FormControlLabel value="disable" control={<Radio />} label="해제" />
      <FormControlLabel value="enable" control={<Radio />} label="설정" />
    </RadioGroup>
  )
}

function NickNameInput(props: {
  value: string
  setValue: (value: string) => void
}) {
  return (
    <TextField
      label="닉네임"
      variant="standard"
      value={props.value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        props.setValue(e.target.value)
      }}
    />
  )
}

export function RegisterUser(props: {
  setIsLoggedIn: (value: boolean) => void
}) {
  const [nickname, setNickname] = useState('')
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)
  const [avatar, _setavatar] = useState(
    'https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/12/2.jpg?resize=500%2C500&ssl=1',
  )

  const navigate = useNavigate()

  const handleSubmit = () => {
    fetch('/api/auth/ft/register', {
      method: 'PUT',
      body: JSON.stringify({
        nickname,
        avatar,
        twoFactor: enableTwoFactor,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.sessionStorage.getItem('temp_token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject(res)
        }
        const { access_token } = await res.json()
        if (enableTwoFactor) {
          window.sessionStorage.setItem('temp_token', access_token)
          navigate('/two-factor')
        } else {
          props.setIsLoggedIn(true)
          window.sessionStorage.setItem('access_token', access_token)
          navigate('/')
        }
      })
      .catch((_) => {
        navigate('/')
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Log>
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <NickNameInput value={nickname} setValue={setNickname} />
          </div>
        </Box>
        <div style={{ textAlign: 'center' }}>
          <Img src={avatar} />
        </div>
        <FormControl>
          <FormLabel>2차 인증(2FA) 설정</FormLabel>
          <TwoFactorButton
            value={enableTwoFactor ? 'enable' : 'disable'}
            setValue={setEnableTwoFactor}
          />
        </FormControl>
        <Button variant="outlined" onClick={handleSubmit}>
          설정 완료
        </Button>
      </Log>
    </ThemeProvider>
  )
}
