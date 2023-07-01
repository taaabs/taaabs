import {
  Dispatch as OtherUserDispatch,
  State as OtherUserState,
} from '@repositories/stores/other-user/other-user.store'
import {
  GlobalDispatch as GlobalDispatch,
  GlobalState as GlobalState,
} from '@repositories/stores/global/global.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Root store
export const useGlobalDispatch = () => useDispatch<GlobalDispatch>()
export const useGlobalSelector: TypedUseSelectorHook<GlobalState> = useSelector

// Other user store
export const useOtherUserDispatch = () => useDispatch<OtherUserDispatch>()
export const useOtherUserSelector: TypedUseSelectorHook<OtherUserState> =
  useSelector
