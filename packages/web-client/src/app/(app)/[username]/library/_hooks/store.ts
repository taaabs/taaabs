import {
  LibraryDispatch,
  LibraryState,
} from '@repositories/stores/user-public/library/library.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useLibraryDispatch = () => useDispatch<LibraryDispatch>()
export const useLibrarySelector: TypedUseSelectorHook<LibraryState> =
  useSelector
