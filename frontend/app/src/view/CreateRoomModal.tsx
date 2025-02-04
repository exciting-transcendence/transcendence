import React, { useRef, useState } from 'react'
import {
  Box,
  Input,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Modal,
} from '@mui/material'
import { Socket } from 'socket.io-client'
import { ChatSocket, Message, RoomType } from 'data'
import { queryClient } from 'hook'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

interface RoomOptionProps {
  setPassword: (value: string) => void
  roomType: RoomType
}
export const RoomOptionSecond = ({
  roomType,
  setPassword,
}: RoomOptionProps) => {
  const [pwd, setPwd] = useState('false')
  if (roomType === 'PUBLIC') {
    return (
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      >
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="암호미설정"
        />
        <FormControlLabel value="true" control={<Radio />} label="암호설정" />
        {pwd === 'true' ? (
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="암호를 입력해주세요"
          ></Input>
        ) : (
          <></>
        )}
      </RadioGroup>
    )
  } else {
    return (
      <Typography
        id="modal-modal-title"
        variant="caption"
        component="h2"
        height={42}
        align="justify"
      >
        참여 가능한 채팅 리스트에 표시되지 않습니다.
      </Typography>
    )
  }
}
interface Props {
  modal: boolean
  setModal: (value: boolean) => void
  socket: ChatSocket
}
export const CreateRoomModal = ({ modal, setModal, socket }: Props) => {
  const [roomType, setRoomType] = useState<RoomType>('PUBLIC')
  const [password, setPassword] = useState('')
  const input = useRef<HTMLInputElement>()
  const handleClose = () => setModal(false)
  const [errMsg, setErrMsg] = useState('')

  const createRoom = () => {
    const roomName = input.current?.value
    if (!roomName) {
      setErrMsg('방 이름을 입력해주세요')
      return
    }
    if (roomName.search(/^\w{2,30}$/) === -1) {
      setErrMsg('방 제목은 2~30자 영문으로 만들어주세요')
      return
    } else if (password) {
      socket.emit('CREATE', {
        title: roomName,
        type: 'PROTECTED',
        password: password,
      })
    } else socket.emit('CREATE', { title: roomName, type: roomType })
    handleClose()
  }
  return (
    <div>
      <Modal
        open={modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            방 만들기
          </Typography>
          <Input placeholder="방 제목을 지정해주세요" inputRef={input}></Input>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value as RoomType)}
          >
            <FormControlLabel
              value="PUBLIC"
              control={<Radio />}
              label="공개방"
            />
            <FormControlLabel
              value="PRIVATE"
              control={<Radio />}
              label="비공개방"
            />
          </RadioGroup>
          <RoomOptionSecond setPassword={setPassword} roomType={roomType} />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {errMsg}
          </Typography>

          <Button onClick={createRoom} fullWidth={true}>
            방만들기
          </Button>
        </Box>
      </Modal>
    </div>
  )
}
