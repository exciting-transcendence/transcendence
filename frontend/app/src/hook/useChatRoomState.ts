import { atom } from 'recoil'

export const useSelectedChatState = atom<number | undefined>({
  key: 'useSelectedChatState',
  default: undefined,
})
