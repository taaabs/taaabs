import {
  LibraryDispatch,
  LibraryState,
} from '@repositories/stores/other-user/library/library.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Other user store
export const useLibraryDispatch = () => useDispatch<LibraryDispatch>()
export const useLibrarySelector: TypedUseSelectorHook<LibraryState> =
  useSelector
