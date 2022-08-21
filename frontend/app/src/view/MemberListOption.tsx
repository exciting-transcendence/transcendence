import { Box, Button } from '@mui/material'

export const MemberListOption = () => {
  return (
    <Box sx={{ display: 'flex' }} justifyContent="center">
      <Button variant="outlined" size="small">
        MUTE
      </Button>
      <Button variant="outlined" size="small">
        BAN
      </Button>
      <Button variant="outlined" size="small">
        관리자지정
      </Button>
      <Button variant="outlined" size="small">
        게임초대
      </Button>
    </Box>
  )
}
