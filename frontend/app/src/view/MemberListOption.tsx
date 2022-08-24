import { Box, Button, Input } from '@mui/material'
import { OtherUser, User, ChatUser, BanUser, RoomType } from 'data'
import { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatSocketContext, PongSocketContext } from '../router/Main'
interface Props {
  // TODO: ChatUser 배열을 받아 추가 정보 표시?
  /** 모든 사용자 */
  user: ChatUser
  /** 로그인한 사용자 */
  refUser: ChatUser | undefined
  roomInfo: { bool: boolean; roomId: number; roomType: RoomType }
  off: () => void
}

interface BanProps {
  user: BanUser
  /** 로그인한 사용자 */
  refUser: ChatUser | undefined
  roomInfo: { bool: boolean; roomId: number; roomType: RoomType }
  off: () => void
}
type UserType = 'Nothing' | 'Admin' | 'Owner'

export const OptionForBanned = ({ user, refUser, roomInfo, off }: BanProps) => {
  const socket = useContext(ChatSocketContext)
  if (refUser === undefined || socket === undefined) return <></>
  const handleBan = () => {
    socket.emit('UNBAN', {
      roomId: roomInfo.roomId,
      uid: user.user.uid,
    })
    off()
  }
  return (
    <>
      <Box sx={{ display: 'flex' }} justifyContent="center">
        <Button variant="outlined" size="small" onClick={handleBan}>
          UNBAN
        </Button>
      </Box>
    </>
  )
}

export const MemberListOption = ({ user, refUser, roomInfo, off }: Props) => {
  const [me, setMe] = useState<UserType>('Nothing')
  const [other, setOther] = useState<UserType>('Nothing')
  const [adminMsg, setAdminMsg] = useState('관리자 지정')
  const socket = useContext(ChatSocketContext)
  const isMuted: boolean = new Date(user.endOfMute) > new Date()
  // const [muteSec, setMuteSec] = useState<string>('')
  // const [banSec, setBanSec] = useState<string>('')
  let muteText = 'MUTE'
  if (isMuted) muteText = 'UNMUTE'
  if (refUser === undefined || socket === undefined) return null
  useEffect(() => {
    if (refUser.isOwner) setMe('Owner')
    else if (refUser.isAdmin) setMe('Admin')
    else setMe('Nothing')
    if (user.isOwner) setOther('Owner')
    else if (user.isAdmin) {
      setAdminMsg('관리자 지정 해제')
      setOther('Admin')
    } else {
      setAdminMsg('관리자 지정')
      setOther('Nothing')
    }
  })
  console.log(refUser, user, me, other, isMuted)
  const handleAdmin = () => {
    if (other === 'Admin')
      socket.emit('REMOVE_ADMIN', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
      })
    else if (other === 'Nothing') {
      socket.emit('ADD_ADMIN', { roomId: roomInfo.roomId, uid: user.user.uid })
    }
  }
  const handleMute = () => {
    if (isMuted === false) {
      socket.emit('MUTE', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
        muteSec: 1000,
      })
    } else if (isMuted === true)
      socket.emit('UNMUTE', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
      })
  }
  const handleBan = () => {
    socket.emit('BAN', {
      roomId: roomInfo.roomId,
      uid: user.user.uid,
    })
    off()
  }
  if (roomInfo.roomType === 'DM')
    return (
      <Box sx={{ display: 'flex' }} justifyContent="center">
        <InviteGameButton
          user={user.user}
          refUser={refUser.user}
          roomId={roomInfo.roomId}
        />
      </Box>
    )
  else {
    return (
      <>
        {me !== 'Nothing' && other !== 'Owner' ? (
          <Box sx={{ display: 'flex' }} justifyContent="center">
            <Button variant="outlined" size="small" onClick={handleMute}>
              {/* {isMuted ? (
                null
              ) : (
                <Input
                  onChange={(e) => setMuteSec(e.target.value)}
                  placeholder="초"
                />
              )} */}
              {muteText}
            </Button>
            <Button variant="outlined" size="small" onClick={handleBan}>
              BAN
            </Button>
          </Box>
        ) : null}
        <Box sx={{ display: 'flex' }} justifyContent="center">
          {me !== 'Nothing' && other !== 'Owner' ? (
            <Button variant="outlined" size="small" onClick={handleAdmin}>
              {adminMsg}
            </Button>
          ) : null}
          <InviteGameButton
            user={user.user}
            refUser={refUser.user}
            roomId={roomInfo.roomId}
          />
        </Box>
      </>
    )
  }
}
interface InviteButtonProps {
  user: OtherUser
  refUser: OtherUser
  roomId: number
}
const InviteGameButton = ({ user, refUser, roomId }: InviteButtonProps) => {
  const chatSocket = useContext(ChatSocketContext)
  const pongSocket = useContext(PongSocketContext)
  const navigate = useNavigate()

  if (!chatSocket || !pongSocket) return null

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={() => {
        pongSocket.emit('match', {
          isPrivate: true,
          mode: 'classic', // 선택기능 추가
        })
        chatSocket.emit('SEND', {
          senderUid: user.uid,
          msgContent: `${refUser.nickname}님이 게임에 초대하였습니다`,
          roomId: roomId,
          inviteUid: user.uid,
          createdAt: new Date(),
        })
        navigate('/game') // TODO: 상대방 수락시 실행되어야함
      }}
    >
      게임초대
    </Button>
  )
}
