import {
  LibraryDispatch,
  LibraryState,
} from '@repositories/stores/user-public/library/library.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const use_library_dispatch = () => useDispatch<LibraryDispatch>()
export const use_library_selector: TypedUseSelectorHook<LibraryState> =
  useSelector
