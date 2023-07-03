import { BookmarkEntity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type LibraryState = {
  isFetchingBookmarks: boolean
  bookmarks: Array<BookmarkEntity.Public> | null
  hasMoreBookmarks: boolean | null
}

const initialState: LibraryState = {
  isFetchingBookmarks: false,
  bookmarks: null,
  hasMoreBookmarks: null,
}

export const librarySlice = createSlice({
  name: 'other-user-library',
  initialState,
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
