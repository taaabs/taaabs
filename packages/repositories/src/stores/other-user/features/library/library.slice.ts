import { BookmarkEntity } from '@/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type LibraryState = {
  isFetchingBookmarks: boolean
  bookmarks: Array<BookmarkEntity.Public> | null
  hasMoreBookmarks: boolean | null
}

const initialLibraryState: LibraryState = {
  isFetchingBookmarks: false,
  bookmarks: null,
  hasMoreBookmarks: null,
}

export const librarySlice = createSlice({
  name: 'library',
  initialState: initialLibraryState,
  reducers: {
    setIsFetchingBookmarks(state, action: PayloadAction<boolean>) {
      state.isFetchingBookmarks = action.payload
    },
    setBookmarks(state, action: PayloadAction<LibraryState['bookmarks']>) {
      state.bookmarks = action.payload
    },
    setHasMoreBookmarks(state, action: PayloadAction<boolean>) {
      state.hasMoreBookmarks = action.payload
    },
  },
})

export const libraryActions = {
  ...librarySlice.actions,
}
