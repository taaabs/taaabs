import {
  Dispatch as OtherUserDispatch,
  State as OtherUserState,
} from '@/stores/other-user/other-user.store'
import {
  Dispatch as RootDispatch,
  State as RootState,
} from '@/stores/root/root.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Root store
export const useRootDispatch = () => useDispatch<RootDispatch>()
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector

// Other user store
export const useOtherUserDispatch = () => useDispatch<OtherUserDispatch>()
export const useOtherUserSelector: TypedUseSelectorHook<OtherUserState> =
  useSelector
