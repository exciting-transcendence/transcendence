import { OtherUser, Stat, User } from 'data'
import {
  Grid,
  Button,
  Input,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeAvatarButton, ChangeNickNameButton } from './userActions'
import { ReactNode } from 'react'
import { AvatarWithStatus } from 'components'
import { renameMutation, useToggles } from 'hook'
import { ButtonGroup, Container } from '@mui/material'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'

const StatDisplay = ({ stat }: { stat?: Stat }) => {
  if (!stat) {
    return <Typography>정보 없음</Typography>
  }
  return (
    <>
      {Object.entries(stat).map(([key, value]) => (
        <Grid key={key}>
          <Typography align="center" variant="subtitle1">
            {key}
          </Typography>
          <Typography align="center">{value}</Typography>
        </Grid>
      ))}
    </>
  )
}

interface Props {
  user: OtherUser
}
export const Profile = ({ user }: Props) => {
  const { uid, stat, avatar, nickname, status } = user

  return (
    <>
      <Grid container justifyContent="center">
        <AvatarWithStatus avatar={avatar} status={status} radius={120} />
      </Grid>
      <Grid container justifyContent="center" alignItems="flex-end" gap={1}>
        <Typography variant="h5">{nickname}</Typography>
        <Typography>{`#${uid}`}</Typography>
      </Grid>
      <Grid container justifyContent="center" gap={3}>
        <StatDisplay stat={stat} />
      </Grid>
    </>
  )
}

interface ActionsProps {
  actions: ReactNode
}
export const ProfileActions = ({ actions }: ActionsProps) => {
  return (
    <Grid container justifyContent="right">
      {actions}
    </Grid>
  )
}
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  height: '50%',
  padding: '2em',
  transform: 'translate(-50%, -50%)',
}
interface FormProps {
  off: () => void
}
const RenameForm = ({ off }: FormProps) => {
  const formContext = useForm<{ nickname: string }>()
  const rename = renameMutation()

  return (
    <FormContainer
      formContext={formContext}
      onSuccess={(data) => {
        if (data.nickname) {
          rename.mutate(data.nickname)
        }
      }}
    >
      <TextFieldElement
        name="nickname"
        label="nickname"
        required
        fullWidth
        validation={{ pattern: /^[A-Za-z]+$/i, minLength: 1, maxLength: 30 }}
      />
      <br />
      <Grid container justifyContent="right">
        <ButtonGroup variant="text">
          <Button type={'submit'} color={'primary'}>
            Submit
          </Button>
          <Button onClick={off}>Close</Button>
        </ButtonGroup>
      </Grid>
    </FormContainer>
  )
}

export const MyProfile = ({ user }: Props) => {
  const [open, { on, off }] = useToggles(false)

  return (
    <>
      <Modal open={open} onClose={off}>
        <Paper sx={modalStyle}>
          <RenameForm off={off} />
        </Paper>
      </Modal>
      <Profile user={user} />
      <ProfileActions
        actions={
          <ButtonGroup>
            <ChangeNickNameButton onClick={on} />
            <ChangeAvatarButton onClick={() => null} />
          </ButtonGroup>
        }
      />
    </>
  )
}
