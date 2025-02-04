import { useState, ChangeEvent, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
//css
import styled from 'styled-components'
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  FormLabel,
  Box,
  Avatar,
  Grid,
} from '@mui/material'

import { useAvatar } from 'hook/useAvatar'

const LogWrap = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Log = styled.div`
  display: grid;
  justify-content: center;
  grid-row-gap: 20px;
  margin: 2rem;
  padding: 2rem;
`

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
  label: string
  setValue: React.Dispatch<
    React.SetStateAction<{
      checked: boolean
      name: string
    }>
  >
}) {
  return (
    <TextField
      label={props.label}
      variant="standard"
      value={props.value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        props.setValue({ checked: false, name: e.target.value })
      }}
    />
  )
}

export function RegisterUser(props: {
  setIsLoggedIn: (value: boolean) => void
}) {
  const imgInput = useRef<HTMLInputElement>(null)
  const [nickname, setNickname] = useState({ checked: false, name: '' })
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)
  const [avatarFilename, avatar, setAvatarFilename] = useAvatar(
    '/api/avatar/default.jpg',
  )
  const [nicknameLabel, setNicknameLabel] = useState('닉네임을 입력해주세요')

  const navigate = useNavigate()

  const sendAvatar = (avatar: File) => {
    const formdata = new FormData()
    formdata.append('file', avatar)

    const token = window.localStorage.getItem('temp_token')
    fetch('/api/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    })
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject(res.statusText)
        } else {
          const { filename } = await res.json()
          setAvatarFilename(`/api/avatar/${filename}`)
        }
      })
      .catch((err) => {
        console.log(err.status)
      })
  }

  const handleSubmit = () => {
    if (nickname.checked === false || nickname.name === '')
      return setNicknameLabel('닉네임 중복 확인을 해주세요')
    fetch('/api/auth/ft/register', {
      method: 'PUT',
      body: JSON.stringify({
        nickname: nickname.name,
        twoFactor: enableTwoFactor,
        avatar: avatarFilename,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('temp_token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject(res)
        }
        const { access_token } = await res.json()
        if (enableTwoFactor) {
          window.localStorage.setItem('temp_token', access_token)
          navigate('/two-factor')
        } else {
          props.setIsLoggedIn(true)
          window.localStorage.setItem('access_token', access_token)
          navigate('/')
        }
      })
      .catch(() => {
        navigate('/')
      })
  }

  const handleNicknameCheck = () => {
    fetch(`/api/user/check?nickname=${nickname.name}`)
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject('다시 시도해 주세요')
        }

        const isAvailable = await res.json()

        if (isAvailable) {
          setNickname({ checked: true, name: nickname.name })
          setNicknameLabel('사용 가능합니다')
        } else {
          return Promise.reject('이미 사용중인 닉네임입니다')
        }
      })
      .catch((err) => {
        setNicknameLabel(err)
      })
  }

  return (
    <LogWrap>
      <Log>
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <NickNameInput
              label={nicknameLabel}
              value={nickname.name}
              setValue={setNickname}
            />
          </div>
        </Box>
        <Button variant="outlined" onClick={handleNicknameCheck}>
          중복 확인
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
          </Grid>
        </Grid>
        <input
          ref={imgInput}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files !== null) {
              sendAvatar(e.target.files[0])
            }
          }}
          style={{ display: 'none' }}
        />
        <Button variant="outlined" onClick={() => imgInput.current?.click()}>
          이미지 업로드
        </Button>
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
    </LogWrap>
  )
}
